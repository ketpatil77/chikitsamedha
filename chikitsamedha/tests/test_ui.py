from pathlib import Path


def test_index_exists():
    p = Path(__file__).resolve().parents[1] / 'frontend' / 'index.html'
    assert p.exists()

