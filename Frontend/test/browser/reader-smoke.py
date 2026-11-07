"""Native reader, real synthetic local imports. HTTP failures below are explicit fixtures."""
import argparse
import json
import re
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from console_checks import capture_console

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://localhost:5173')
parser.add_argument('--output', required=True)
parser.add_argument('--chromium-path', default=shutil.which('chromium'))
args = parser.parse_args()
base, output = args.base_url.rstrip('/'), Path(args.output)
output.mkdir(parents=True, exist_ok=True)
work_id = 'orbita-de-papel'
chapters_path = f'/api/works/{work_id}/chapters'
detail_path = f'/obras/{work_id}?q=%C3%93rbita&format=manhwa'
results = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=args.chromium_path)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    page = context.new_page()
    console, js_errors, external = capture_console(page), [], []
    page.on('pageerror', lambda error: js_errors.append(str(error)))
    page.on('request', lambda request: external.append(request.url) if not request.url.startswith(base + '/') else None)
    catalog = context.request.get(base + '/api/works')
    assert catalog.status == 200 and len(catalog.json()['items']) == 6
    assert context.request.get(base + '/api/health').status == 503  # PG not configured, never simulated.
    response = context.request.get(base + chapters_path)
    assert response.status == 200 and [c['number'] for c in response.json()['chapters']] == ['1', '2', '10']
    assert response.headers['cache-control'] == 'no-store'

    def overflow(label):
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), label
        assert page.locator('main').evaluate('(n) => n.scrollWidth <= n.clientWidth + 1'), label

    def ready(number):
        expect(page.get_by_role('heading', level=1, name=f'Órbita de papel · Capítulo {number}')).to_be_visible()

    def images_ready():
        for image in page.locator('.reader-page img').all():
            image.scroll_into_view_if_needed()
            expect(image).to_have_js_property('complete', True)
            expect(image).to_have_js_property('naturalWidth', 800)
            bounds = image.bounding_box()
            assert abs(bounds['width'] / bounds['height'] - 800/1400) < .01

    for width, height in [(1440, 1000), (768, 1024), (390, 844), (320, 800)]:
        page.set_viewport_size({'width': width, 'height': height})
        page.goto(base + detail_path)
        expect(page.get_by_role('heading', level=1, name='Órbita de papel')).to_be_visible()
        expect(page.locator('.chapter-list a')).to_have_count(3)
        overflow(('list', width))
        page.screenshot(path=str(output / f'capitulos-{width}.png'), full_page=True, animations='disabled')
        page.get_by_role('link', name='Leer desde el primer capítulo').click()
        ready('1')
        expect(page.get_by_role('combobox', name='Ir al capítulo')).to_have_value('1')
        assert page.get_by_role('link', name=re.compile('Capítulo anterior')).count() == 0
        images_ready()
        overflow(('reader', width))
        page.evaluate('scrollTo(0,0)')
        page.screenshot(path=str(output / f'lector-{width}.png'), full_page=True, animations='disabled')
        top_nav = page.get_by_role('navigation', name='Capítulos, inicio del lector')
        top_nav.get_by_role('link', name=re.compile('Capítulo siguiente')).click()
        ready('2')
        page.get_by_role('navigation', name='Capítulos, inicio del lector').get_by_role('link', name=re.compile('Capítulo siguiente')).click()
        ready('10')
        assert page.get_by_role('link', name=re.compile('Capítulo siguiente')).count() == 0
        page.reload(); ready('10')
        page.go_back(); ready('2')
        page.go_forward(); ready('10')
        page.get_by_role('combobox', name='Ir al capítulo').select_option('1'); ready('1')
        page.get_by_role('link', name='Volver a la ficha').click()
        expect(page.get_by_role('heading', level=1, name='Órbita de papel')).to_be_visible()
        page.get_by_role('link', name=re.compile('Volver al catálogo')).click()
        expect(page.get_by_role('searchbox')).to_have_value('Órbita')
        expect(page.get_by_role('combobox', name='Formato')).to_have_value('manhwa')
        expect(page.locator('.work-card')).to_have_count(1)
        results.append({'width': width, 'overflow': False, 'page_ratio': '800:1400', 'navigation_filters_history_reload': 'passed'})

    page.goto(base + '/obras/archivo-aurora')
    expect(page.get_by_text('Todavía no hay capítulos disponibles para esta obra.')).to_be_visible()
    with console.expect_network(chapters_path + '/3', 404):
        page.goto(base + f'/obras/{work_id}/capitulos/3')
        expect(page.get_by_role('heading', name='Capítulo no disponible')).to_be_visible()
    # Retryable list failure (controlled HTTP fixture, not a claim of stopping the real server).
    page.route('**' + chapters_path, lambda route: route.fulfill(status=503, json={'error': 'reader_unavailable'}))
    with console.expect_network(chapters_path, 503):
        page.goto(base + detail_path)
        expect(page.get_by_role('alert')).to_have_text('No se pudieron cargar los capítulos.')
    page.unroute('**' + chapters_path)
    page.get_by_role('button', name='Reintentar capítulos').click()
    expect(page.get_by_role('link', name='Leer desde el primer capítulo')).to_be_visible()
    # Real media URL, one injected HTTP failure, then retry reaches the real PNG endpoint.
    media = chapters_path + '/1/pages/1'
    page.route('**' + media, lambda route: route.fulfill(status=503, body=''))
    with console.expect_network(media, 503):
        page.goto(base + f'/obras/{work_id}/capitulos/1')
        expect(page.get_by_role('alert')).to_have_text('No se pudo cargar la página 1.')
    page.unroute('**' + media)
    page.get_by_role('button', name='Reintentar página 1').click()
    images_ready()
    # Keyboard focus and reduced motion on reader; no personal state or storage is created.
    page.emulate_media(reduced_motion='reduce')
    page.goto(base + f'/obras/{work_id}/capitulos/2')
    ready('2')
    page.keyboard.press('Tab')
    expect(page.get_by_role('link', name='Saltar al contenido')).to_be_focused()
    page.keyboard.press('Enter')
    expect(page.locator('main')).to_be_focused()
    page.keyboard.press('Tab')
    focused = page.locator(':focus')
    assert focused.evaluate('(n) => getComputedStyle(n).outlineStyle') != 'none'
    assert focused.evaluate('(n) => parseFloat(getComputedStyle(n).outlineWidth)') >= 2
    assert page.locator('.reader-nav-link').first.evaluate('(n) => getComputedStyle(n).transitionDuration') == '0s'
    assert page.evaluate('localStorage.length') == 0
    assert not js_errors, js_errors
    assert not console['unexpected'], console
    assert not external, external
    report = {'base_url': base, 'viewports': results, 'fixture_chapters': ['1', '2', '10'], 'original_pages_per_chapter': 3, 'catalog_records': 6, 'postgresql': 'unavailable (expected 503)', 'keyboard_focus_reduced_motion': 'passed', 'empty_missing_retry': 'passed', 'media_retry': 'passed', 'console': console, 'javascript_errors': js_errors, 'external_requests': external, 'limitations': ['viewport simulation, not physical mobile devices', 'Chromium only', 'no native PostgreSQL or Docker validation', 'no full screen-reader/a11y audit']}
    (output / 'verificacion.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    browser.close()
