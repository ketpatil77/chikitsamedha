from fastapi.testclient import TestClient
from chikitsamedha.backend.app import app

client = TestClient(app)


def test_list():
    r = client.get('/api/list')
    assert r.status_code == 200
    js = r.json()
    assert 'drugs' in js and len(js['drugs']) >= 100


def test_check():
    payload = {'profile': {'age': 70, 'weight': 60, 'height': 170, 'diseases': ['BP']}, 'medicines': ['Ibuprofen', 'Atenolol']}
    r = client.post('/api/check', json=payload)
    assert r.status_code == 200
    js = r.json()
    assert js['result']['risk_level'] in {'Low','Medium','High'}

