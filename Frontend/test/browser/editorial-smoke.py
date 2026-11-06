"""Lavender editorial composition against the real existing API; no Docker calls."""
import argparse
import json
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from console_checks import capture_console

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://localhost:5173')
parser.add_argument('--output', default='.local/editorial-lavanda')
args = parser.parse_args()
base = args.base_url.rstrip('/')
output = Path(args.output)
output.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=shutil.which('chromium'))
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    console = capture_console(page)
    response = page.request.get(base + '/api/works')
    assert response.status == 200
    data = response.json()
    assert data['source'] == {'kind': 'synthetic', 'persisted': False}
    assert len(data['items']) == 6
    first = data['items'][0]
    results = []
    page.goto(base + '/')
    expect(page.get_by_role('heading', level=1, name=first['title'])).to_be_visible()
    background = page.locator('body').evaluate('node => getComputedStyle(node).backgroundColor')
    assert background == 'rgb(16, 16, 23)', ('lavender background', background)
    for width, height, columns in [(1440, 1000, 6), (768, 1024, 3), (390, 844, 2), (320, 800, 2)]:
        page.set_viewport_size({'width': width, 'height': height})
        for path, view in [('/', 'inicio'), ('/explorar', 'explorar'), ('/obras/' + first['id'], 'detalle')]:
            page.goto(base + path)
            expect(page.get_by_role('heading', level=1)).to_be_visible()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (path, width)
            if view == 'inicio':
                if width <= 599:
                    expect(page.locator('.home-feature-cover')).not_to_be_visible()
                    expect(page.locator('.hero-panorama')).to_be_visible()
                    expect(page.get_by_role('link', name='Descubrir la obra: ' + first['title'], exact=True)).to_be_visible()
                stories = page.get_by_role('region', name='Historias destacadas')
                expect(stories.get_by_role('article')).to_have_count(6)
                links = stories.get_by_role('link', name='Ver ficha de', exact=False)
                assert [link.get_attribute('href') for link in links.all()] == ['/obras/' + item['id'] for item in data['items']]
                positions = stories.locator('.work-card').evaluate_all('nodes => nodes.map(node => Math.round(node.getBoundingClientRect().x))')
                assert len(set(positions)) == columns, (width, positions)
                assert page.locator('.genre-discovery').evaluate('(node) => !!(node.compareDocumentPosition(document.querySelector(".featured-stories")) & Node.DOCUMENT_POSITION_FOLLOWING)')
                expect(page.get_by_role('list', name='Géneros de la obra destacada')).to_be_visible()
                last = page.locator('.genre-link').last
                last.focus()
                box = last.bounding_box()
                assert box['x'] >= 0 and box['x'] + box['width'] <= width + 1, (width, box)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                page.locator('body').click(position={'x': 2, 'y': 2})
                page.locator('.genre-links').evaluate('node => node.scrollLeft = 0')
                page.evaluate('window.scrollTo(0,0)')
            if view == 'explorar':
                expect(page.get_by_role('link', name='Ver ficha de', exact=False)).to_have_count(6)
            if view == 'detalle':
                expect(page.get_by_role('heading', level=1, name=first['title'])).to_be_visible()
                expect(page.get_by_role('link', name='Volver al catálogo', exact=False)).to_have_attribute('href', '/explorar')
            invitation = page.get_by_role('region', name='Tu próxima historia te espera')
            expect(invitation.get_by_role('link', name='Descubrir el catálogo', exact=False)).to_have_attribute('href', '/explorar')
            page.screenshot(path=str(output / f'{view}-{width}.png'), full_page=True, animations='disabled')
            results.append({'width': width, 'path': path, 'overflow': False})
    assert not console['unexpected'], console['unexpected']
    report = {'background': background, 'responsive': results, 'featuredColumns': [6, 3, 2, 2], 'realApiWorks': 6, 'console': console}
    (output / 'mediciones.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    browser.close()
