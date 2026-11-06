"""Increment 4: original covers, detail metadata and viewport changes. Native servers only."""
import argparse
import json
import re
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from console_checks import capture_console

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://localhost:5173')
parser.add_argument('--output', default='.local/inc4-visual')
parser.add_argument('--phase', choices=['antes', 'despues'], default='despues')
parser.add_argument('--capture-only', action='store_true', help='Capture the untouched baseline without new assertions.')
parser.add_argument('--chromium-path', default=shutil.which('chromium') or shutil.which('chromium-browser'))
args = parser.parse_args()
base = args.base_url.rstrip('/')
output = Path(args.output) / args.phase
output.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    options = {'headless': True}
    if args.chromium_path:
        options['executable_path'] = args.chromium_path
    browser = p.chromium.launch(**options)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='no-preference')
    page = context.new_page()
    console = capture_console(page)
    errors, external = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('request', lambda request: external.append(request.url) if not request.url.startswith(base + '/') else None)
    response = context.request.get(base + '/api/works')
    assert response.status == 200
    data = response.json()
    assert data['source'] == {'kind': 'synthetic', 'persisted': False} and len(data['items']) == 6
    work = data['items'][0]

    def shot(name):
        page.screenshot(path=str(output / (name + '.png')), full_page=True, animations='disabled')

    def detail():
        page.goto(base + '/obras/archivo-aurora?q=Aurora&format=manga')
        expect(page.get_by_role('heading', level=1, name=work['title'])).to_be_visible()

    def no_overflow(label):
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), label
        assert page.locator('main').evaluate('(n) => n.scrollWidth <= n.clientWidth + 1'), label

    def cover_ratios(label):
        ratios = page.locator('.work-cover:visible').evaluate_all('(nodes) => nodes.map(n => {const r=n.getBoundingClientRect();return r.width/r.height;})')
        assert all(abs(r - .75) < .01 for r in ratios), (label, ratios)
        return ratios

    detail()
    shot('ficha-desktop')
    page.set_viewport_size({'width': 390, 'height': 844})
    detail()
    shot('ficha-mobile')
    detail_position = page.evaluate('''() => ({titleTop:document.querySelector('h1').getBoundingClientRect().y,
      coverTop:document.querySelector('.work-cover').getBoundingClientRect().y})''')
    page.goto(base + '/')
    expect(page.get_by_role('heading', level=1, name=work['title'])).to_be_visible()
    shot('inicio-mobile')
    page.goto(base + '/explorar?q=%C3%93RBITA&format=manhwa')
    expect(page.get_by_role('link', name='Ver ficha de Órbita de papel')).to_be_visible()
    shot('filtros-mobile')
    page.locator('.catalog-header').screenshot(path=str(output / 'navegacion-mobile.png'))
    page.set_viewport_size({'width': 1440, 'height': 1000})
    page.goto(base + '/explorar')
    expect(page.locator('.work-card')).to_have_count(6)
    page.locator('.works-grid').screenshot(path=str(output / 'seis-ilustraciones.png'), animations='disabled')
    art_nodes = page.locator('.cover-artwork').evaluate_all('(nodes) => nodes.map(n => n.querySelectorAll("*").length)')
    report = {'phase': args.phase, 'base_url': base, 'detail_mobile_positions': detail_position, 'art_nodes': art_nodes}
    if args.capture_only:
        report['mode'] = 'baseline captures only; new acceptance checks not run'
    else:
        results = []
        for width, height in [(1440, 1000), (768, 1024), (390, 844), (320, 800)]:
            page.set_viewport_size({'width': width, 'height': height})
            for path in ['/', '/explorar', '/obras/archivo-aurora']:
                page.goto(base + path)
                expect(page.locator('.work-cover:visible').first).to_be_visible()
                no_overflow((width, path))
                cover_ratios((width, path))
                for control in page.locator('.catalog-header a, .catalog-footer a, .catalog-search input, .catalog-search select, .catalog-search button').all():
                    r = control.bounding_box()
                    assert r['width'] >= 44 and r['height'] >= 44, (width, path, r)
                if path.startswith('/obras/'):
                    assert page.locator('h1').bounding_box()['y'] < page.locator('.work-cover').bounding_box()['y'] if width <= 599 else True
                results.append({'width': width, 'path': path, 'overflow': False})
        # Rotation is viewport simulation, not a claim about a physical device.
        page.goto(base + '/explorar?q=Aurora&format=manga')
        for width, height in [(390, 844), (844, 390), (320, 800), (768, 1024), (1440, 1000)]:
            page.set_viewport_size({'width': width, 'height': height})
            expect(page.get_by_role('searchbox')).to_have_value('Aurora')
            expect(page.get_by_role('combobox')).to_have_value('manga')
            no_overflow(('rotation', width))
        page.get_by_role('link', name='Ver ficha de Archivo Aurora').click()
        page.get_by_role('link', name=re.compile('Volver al catálogo')).click()
        expect(page.get_by_role('searchbox')).to_have_value('Aurora')
        # Controlled HTTP fixtures exercise the real client validation and preserve production records.
        long_work = {**work, 'title': 'Horizontes imaginarios ' * 8 + 'A' * 120,
                     'synopsis': ('Una sinopsis ficticia con acentos, <script>texto</script> y & símbolos.\n\n' * 8) + 'N' * 220,
                     'genres': ['Género ficticio ' + str(i) + 'Z' * 85 for i in range(10)]}
        page.route('**/api/works/archivo-aurora', lambda route: route.fulfill(json={'source': data['source'], 'item': long_work}))
        for width in [1440, 768, 390, 320]:
            page.set_viewport_size({'width': width, 'height': 1000 if width > 400 else 844})
            page.goto(base + '/obras/archivo-aurora?q=Aurora&format=manga')
            expect(page.get_by_role('heading', level=1, name=long_work['title'])).to_be_visible()
            no_overflow(('long detail', width))
            cover_ratios(('long detail', width))
            assert page.locator('.genre-tags').evaluate('(n) => n.scrollWidth <= n.clientWidth + 1')
            assert page.locator('.synopsis script').count() == 0
            expect(page.get_by_role('link', name=re.compile('Volver al catálogo'))).to_have_attribute('href', '/explorar?q=Aurora&format=manga')
        shot('ficha-fixture-extensa-320')
        # Artwork stays decorative; essential text remains when it cannot be seen.
        expect(page.locator('.cover-artwork')).to_have_attribute('aria-hidden', 'true')
        page.locator('.cover-artwork').evaluate('(n) => n.style.visibility="hidden"')
        expect(page.get_by_role('heading', level=1, name=long_work['title'])).to_be_visible()
        page.unroute('**/api/works/archivo-aurora')
        page.route('**/api/works', lambda route: route.fulfill(json={'source': data['source'], 'items': [long_work]}))
        for path in ['/', '/explorar']:
            page.goto(base + path)
            expect(page.get_by_role('link', name='Ver ficha de ' + long_work['title'])).to_be_visible()
            no_overflow(('long list', path))
            cover_ratios(('long list', path))
        page.unroute('**/api/works')
        page.route('**/api/works/archivo-aurora', lambda route: route.fulfill(json={'source': data['source'], 'item': {**work, 'synopsis': '  ', 'genres': ['', ' ', 'Drama', 'Drama']}}))
        detail()
        expect(page.get_by_text('Sinopsis no disponible en esta demostración.')).to_be_visible()
        expect(page.get_by_role('region', name='Géneros').get_by_text('Drama', exact=True)).to_have_count(1)
        no_overflow('empty fields')
        shot('ficha-fixture-parcial')
        page.unroute('**/api/works/archivo-aurora')
        page.route('**/api/works/archivo-aurora', lambda route: route.fulfill(json={'source': data['source'], 'item': None}))
        page.goto(base + '/obras/archivo-aurora')
        expect(page.get_by_role('alert')).to_contain_text('No se pudo cargar la ficha')
        shot('ficha-respuesta-invalida')
        page.unroute('**/api/works/archivo-aurora')
        page.get_by_role('button', name='Reintentar').click()
        expect(page.get_by_role('heading', level=1, name=work['title'])).to_be_visible()
        with console.expect_network('/api/works/no-existe', '404'):
            page.goto(base + '/obras/no-existe?q=Aurora&format=manga')
            expect(page.get_by_role('heading', level=1, name='No encontramos esta obra')).to_be_visible()
            expect(page.get_by_role('link', name=re.compile('Volver al catálogo'))).to_have_attribute('href', '/explorar?q=Aurora&format=manga')
            shot('ficha-no-encontrada')
        page.emulate_media(reduced_motion='reduce')
        detail()
        motion = page.locator('.work-cover').evaluate('(n) => {const s=getComputedStyle(n);return [s.transitionDuration,s.animationName,s.transform,s.scrollBehavior];}')
        assert motion == ['0s', 'none', 'none', 'auto']
        report.update({'responsive': results, 'rotation_filters': 'passed', 'long_partial_invalid_fixtures_retry': 'passed', 'decorative_art_text_survives': 'passed', 'reduced_motion': motion})
    assert not errors, errors
    assert not console['unexpected'], console['unexpected']
    assert not external, external
    report.update({'page_errors': errors, 'external_requests': external, 'console': console})
    (output / 'mediciones.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    browser.close()
