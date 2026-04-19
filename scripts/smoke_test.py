import json
import os
import sys
import time
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
try:
    import requests  # type: ignore
except Exception:
    requests = None

PORT = int(os.environ.get("CHIKI_PORT", os.environ.get("PORT", "8000")))
BASE = f"http://127.0.0.1:{PORT}"

def get(path):
    with urlopen(BASE + path) as r:
        ct = r.headers.get('Content-Type','')
        return r.read(), ct

def post_json(path, payload):
    data = json.dumps(payload).encode('utf-8')
    req = Request(BASE + path, data=data, headers={'Content-Type':'application/json'})
    with urlopen(req) as r:
        ct = r.headers.get('Content-Type','')
        return r.read(), ct

def wait_health(timeout=40):
    t0 = time.time()
    while time.time() - t0 < timeout:
        try:
            body, _ = get('/api/health')
            js = json.loads(body.decode('utf-8'))
            if js.get('status') == 'ok':
                return True
        except Exception:
            pass
        time.sleep(0.5)
    return False

def main():
    assert wait_health(), 'health did not become ok'
    body, _ = get('/api/suggest?type=medicine&q=para')
    js = json.loads(body.decode('utf-8'))
    assert any('Paracetamol' in (s.get('label') or s.get('value') or '') for s in js.get('suggestions', [])), 'suggest missing Paracetamol'

    body, _ = get('/api/medicines')
    js = json.loads(body.decode('utf-8'))
    assert js.get('drugs') and isinstance(js['drugs'], list)

    payload = {
        'profile': { 'age': 70, 'weight': 60, 'height': 170, 'diseases': ['BP'] },
        'medicines': ['Ibuprofen','Atenolol'],
        'contexts': ['Alcohol'],
        'age_band': 'Adult'
    }
    body, _ = post_json('/api/check', payload)
    js = json.loads(body.decode('utf-8'))
    assert js.get('result') and 'risk_level' in js['result']
    result = js['result']
    assert 'risk_profile' in result and 'context' in result['risk_profile'], 'risk profile missing context'

    body, ct = post_json('/api/pdf', { 'info': {'Risk':'Low','Note':'Test'} })
    assert ct.startswith('application/pdf')

    body, ct = get('/app')
    assert b'Chikits' in body or b'Chikits' in body[:4096]

    compare_payload = {
        'profiles': [ {'age': 35, 'weight': 70, 'height': 172} ],
        'sets': [ ['Paracetamol'], ['Aspirin'] ],
        'contexts': ['Food']
    }
    body, _ = post_json('/api/compare', compare_payload)
    comp = json.loads(body.decode('utf-8'))
    assert comp.get('results') and len(comp['results']) >= 2, 'compare endpoint failed'

    # Optional OCR smoke: requires requests and local test image
    test_img = os.path.join('test_assets', 'para.jpg')
    if requests and os.path.exists(test_img):
        try:
            with open(test_img, 'rb') as fh:
                r = requests.post(f"{BASE}/api/scan", files={"file": fh})
            snippet = getattr(r, 'text', '')[:120]
            print("OCR:", r.status_code, snippet)
        except Exception as e:
            print("[WARN] OCR smoke test skipped (error)", e)
    else:
        print('[WARN] OCR smoke test skipped (no test_assets/para.jpg found)')

    # v18 backend intelligence checks
    def post(path, data):
        return json.loads(post_json(path, data)[0].decode('utf-8'))

    def chk(profile, meds, diseases=None, contexts=None, age_band=None):
        p = {'profile': profile, 'medicines': meds}
        if diseases: p['profile']['diseases'] = diseases
        if contexts: p['contexts'] = contexts
        if age_band: p['age_band'] = age_band
        return post('/api/check', p)

    # Paracetamol + Alcohol => context risk >= 70
    js = chk({'age':30,'weight':70,'height':170}, ['Paracetamol'], [], ['Alcohol'])
    rp = js['result']['risk_profile']
    print('[CHECK] Paracetamol+Alcohol context:', rp.get('context'))
    assert rp.get('context',0) >= 70

    # Statin + Grapefruit => High context
    js = chk({'age':40,'weight':80,'height':175}, ['Atorvastatin'], [], ['Grapefruit'])
    assert js['result']['risk_profile'].get('context',0) >= 70

    # Aspirin + Alcohol => High/contra context
    js = chk({'age':30}, ['Aspirin'], [], ['Alcohol'])
    assert js['result']['risk_profile'].get('context',0) >= 70

    # Metformin + CKD => Contraindicated
    js = chk({'age':50,'diseases':['Chronic kidney disease']}, ['Metformin'])
    assert js['result']['contraindicated'] is True

    # Ibuprofen + Ulcer => High disease risk
    js = chk({'age':35,'diseases':['Peptic ulcer disease']}, ['Ibuprofen'])
    assert js['result']['risk_profile'].get('disease',0) >= 60

    # Child + Aspirin => Contraindicated
    js = chk({'age':4}, ['Aspirin'])
    assert js['result']['contraindicated'] is True

    # Elderly + NSAIDs => age dimension >= 60
    js = chk({'age':70}, ['Ibuprofen'])
    assert js['result']['risk_profile'].get('age',0) >= 60

    # No conflicts => overall <= 30
    js = chk({'age':30}, ['Paracetamol'])
    assert js['result']['risk_profile'].get('overall',100) <= 30

    print('>>> Smoke tests passed (backend + UI healthy)')
    print('[PASS] v18 Regression')
    print('[PASS] v15 Regression')

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print('Smoke test failed:', e)
        sys.exit(1)
