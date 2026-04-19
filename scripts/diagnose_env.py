import os
import re
import sys
import subprocess as sp


def run(cmd: str) -> tuple[int, str]:
    p = sp.run(cmd, shell=True, capture_output=True, text=True)
    out = (p.stdout or '') + (p.stderr or '')
    return p.returncode, out.strip()


def kill_port(port: int):
    code, out = run(f'netstat -ano ^| findstr :{port}')
    if code != 0:
        return False
    pids = set()
    for line in out.splitlines():
        parts = line.split()
        if parts:
            pid = parts[-1]
            if pid.isdigit():
                pids.add(pid)
    killed = False
    for pid in pids:
        run(f'taskkill /F /PID {pid} >nul 2>&1')
        killed = True
    return killed


def check_python():
    ok = sys.version_info >= (3, 12)
    return ok, f'Python {sys.version.split()[0]}'


def check_pip():
    code, out = run('python -m pip --version')
    return code == 0, out


def check_node():
    code, out = run('node -v')
    if code != 0:
        return False, 'Node not found'
    m = re.match(r'v(\d+)\.', out.strip())
    ok = bool(m and int(m.group(1)) >= 18)
    return ok, out.strip()


def check_npm():
    code, out = run('npm -v')
    return code == 0, out.strip()


def main() -> int:
    # Kill stray processes on dev/frontend and backend ports
    ports = [5173, int(os.getenv('CHIKI_PORT', '8000'))]
    for port in ports:
        if kill_port(port):
            print(f'[INFO] Freed port {port}')

    ok_py, py_msg = check_python()
    ok_pip, pip_msg = check_pip()
    ok_node, node_msg = check_node()
    ok_npm, npm_msg = check_npm()

    print(f"Python: {'OK' if ok_py else 'FAIL'} - {py_msg}")
    print(f"pip: {'OK' if ok_pip else 'FAIL'} - {pip_msg}")
    print(f"Node: {'OK' if ok_node else 'FAIL'} - {node_msg}")
    print(f"npm: {'OK' if ok_npm else 'FAIL'} - {npm_msg}")

    if not (ok_py and ok_pip and ok_node and ok_npm):
        return 1
    print('[STATUS] Python OK | Node OK | Ports Free')
    return 0


if __name__ == '__main__':
    sys.exit(main())
