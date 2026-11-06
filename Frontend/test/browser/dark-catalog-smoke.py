"""Optional visual smoke test; start native Express/Vite first. No Docker calls."""
import argparse
import json
import re
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from console_checks import capture_console

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://localhost:5173')
parser.add_argument('--output', default='.local/ui-azul')
parser.add_argument('--chromium-path', default=shutil.which('chromium') or shutil.which('chromium-browser'))
args = parser.parse_args()
base = args.base_url.rstrip('/')
output = Path(args.output)
output.mkdir(parents=True, exist_ok=True)


def contrast(first, second):
    def luminance(value):
        parts = [int(x) / 255 for x in re.findall(r'\d+', value)[:3]]
        channels = [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in parts]
        return sum(x * weight for x, weight in zip(channels, [.2126, .7152, .0722]))
    values = sorted([luminance(first), luminance(second)])
    return round((values[1] + .05) / (values[0] + .05), 2)


with sync_playwright() as p:
    options = {'headless': True}
    if args.chromium_path:
        options['executable_path'] = args.chromium_path
    browser = p.chromium.launch(**options)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='no-preference')
    page = context.new_page()
    console = capture_console(page)
    errors = []
    external = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('request', lambda request: external.append(request.url) if not request.url.startswith(base + '/') else None)
    response = context.request.get(base + '/api/works')
    assert response.status == 200
    data = response.json()
    assert data['source'] == {'kind': 'synthetic', 'persisted': False}
    assert [work['id'] for work in data['items']] == ['archivo-aurora', 'orbita-de-papel', 'el-jardin-de-los-ecos', 'ciudad-de-tinta', 'despues-del-ultimo-tren', 'la-ruta-del-viento']
    assert context.request.get(base + '/api/health').status == 503

    def catalog():
        return page.get_by_role('link', name=re.compile('Ver ficha de'))

    def screenshot(name):
        page.screenshot(path=str(output / (name + '.png')), full_page=True, animations='disabled')

    # Home consumes the same API; no duplicated static catalog or personal history.
    page.goto(base + '/')
    expect(page.get_by_role('heading', level=1, name=data['items'][0]['title'])).to_be_visible()
    expect(page.get_by_role('region', name='Continuar explorando')).to_be_visible()
    expect(page.get_by_role('region', name='Selección de demostración')).to_be_visible()
    expect(catalog()).to_have_count(6)
    home_viewports = []
    for width, height in [(1440, 1000), (768, 1024), (390, 844), (320, 800)]:
        page.set_viewport_size({'width': width, 'height': height})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), ('home', width)
        expect(page.get_by_role('navigation', name='Principal').get_by_role('link', name='Inicio')).to_have_attribute('aria-current', 'page')
        assert page.get_by_role('searchbox').count() == 1
        assert page.get_by_role('heading', level=1).count() == 1
        for link in page.locator('.catalog-header a, .genre-link').all():
            bounds = link.bounding_box()
            assert bounds['height'] >= 44 and bounds['width'] >= 44, ('home', width, bounds)
        screenshot('inicio-' + str(width))
        if width == 390:
            page.locator('.catalog-header').screenshot(path=str(output / 'navegacion-mobile.png'))
        home_viewports.append({'width': width, 'overflow': False})
    home_ids = page.locator('svg [id]').evaluate_all('(nodes) => nodes.map(node => node.id)')
    assert len(home_ids) == len(set(home_ids))
    # Native keyboard navigation: Home -> Explore -> detail -> back, preserving history.
    page.set_viewport_size({'width': 1440, 'height': 1000})
    page.get_by_role('link', name='Explorar catálogo').focus()
    assert page.get_by_role('link', name='Explorar catálogo').evaluate('(node) => getComputedStyle(node).outlineStyle') == 'solid'
    page.keyboard.press('Enter')
    expect(page).to_have_url(base + '/explorar')
    expect(catalog()).to_have_count(6)
    catalog().first.click()
    expect(page.get_by_role('heading', level=1, name='Archivo Aurora')).to_be_visible()
    page.get_by_role('link', name=re.compile('Volver al catálogo')).click()
    expect(page).to_have_url(base + '/explorar')
    page.go_back()
    expect(page.get_by_role('heading', level=1, name='Archivo Aurora')).to_be_visible()
    page.go_back()
    expect(page).to_have_url(base + '/explorar')
    page.go_back()
    expect(page).to_have_url(base + '/')
    expect(page.get_by_role('heading', level=1, name='Archivo Aurora')).to_be_visible()
    # Search and existing genre links use canonical Explore queries.
    page.get_by_role('searchbox').fill('ÓRBITA')
    page.get_by_role('combobox').select_option('manhwa')
    page.get_by_role('button', name=re.compile('Buscar')).click()
    expect(catalog()).to_have_count(1)
    assert '/explorar?q=%C3%93RBITA&format=manhwa' in page.url
    screenshot('filtros-desktop')
    page.goto(base + '/')
    page.get_by_role('region', name='Descubre por género').get_by_role('link', name='Misterio', exact=True).click()
    expect(page.get_by_role('searchbox')).to_have_value('Misterio')
    expect(catalog()).to_have_count(2)
    page.goto(base + '/explorar')
    expect(catalog()).to_have_count(6)
    screenshot('catalogo-desktop')
    viewport_results = []
    for width, height, name in [(1440, 1000, 'desktop'), (768, 1024, 'tablet'), (390, 844, 'mobile'), (320, 800, 'estrecho')]:
        page.set_viewport_size({'width': width, 'height': height})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), name
        covers = page.locator('.work-card .work-cover').evaluate_all('(nodes) => nodes.map(node => {const r=node.getBoundingClientRect(); return r.width/r.height;})')
        assert all(abs(ratio - .75) < .01 for ratio in covers), (name, covers)
        for link in page.locator('header a').all():
            bounds = link.bounding_box()
            assert bounds['height'] >= 44 and bounds['width'] >= 44, (name, bounds)
        assert page.get_by_role('searchbox').count() == 1
        readable = page.locator('.card-meta, .card-genre, .card-action, .catalog-search label, .hero-note, .demo-banner, .footer-identity > p').evaluate_all('''nodes => nodes.map(node => ({
            text: node.textContent.trim(), size: parseFloat(getComputedStyle(node).fontSize)
        }))''')
        assert all(item['size'] >= 12 for item in readable), (name, readable)
        for control in page.locator('.catalog-search input, .catalog-search select').all():
            space = control.evaluate('''node => {
                const style = getComputedStyle(node);
                const canvas = document.createElement('canvas').getContext('2d');
                canvas.font = style.font;
                const metrics = canvas.measureText('ÁgjTodos los formatos');
                const computedLine = parseFloat(style.lineHeight);
                const line = Number.isNaN(computedLine)
                    ? metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent : computedLine;
                return {height: node.getBoundingClientRect().height,
                    inner: node.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
                    line};
            }''')
            assert space['height'] >= 44 and space['inner'] >= space['line'], (name, space)
        selected_label = page.get_by_role('combobox').evaluate('''node => {
          const style = getComputedStyle(node);
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          context.font = style.font;
          return {
            text: context.measureText(node.selectedOptions[0].text).width,
            available: node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 24
          };
        }''')
        assert selected_label['text'] <= selected_label['available'], (name, selected_label)
        screenshot('catalogo-' + name)
        viewport_results.append({'width': width, 'overflow': False, 'cover_ratio': round(covers[0], 2)})

    page.set_viewport_size({'width': 1440, 'height': 1000})
    page.goto(base + '/explorar')
    expect(catalog()).to_have_count(6)
    page.keyboard.press('Tab')
    expect(page.get_by_role('link', name='Saltar al contenido')).to_be_focused()
    page.keyboard.press('Enter')
    assert page.evaluate('document.activeElement.id') == 'contenido'
    header_search = page.get_by_role('link', name='Buscar en el catálogo')
    header_search.focus()
    page.keyboard.press('Enter')
    expect(page.get_by_role('searchbox')).to_be_focused()
    field_bounds = page.get_by_role('searchbox').bounding_box()
    header_bounds = page.get_by_role('banner').bounding_box()
    assert field_bounds['y'] >= header_bounds['y'] + header_bounds['height'], (field_bounds, header_bounds)
    assert page.get_by_role('searchbox').evaluate('(node) => getComputedStyle(node).outlineStyle') == 'solid'

    colors = page.evaluate('''() => {
      const style = selector => getComputedStyle(document.querySelector(selector));
      return {
        body: [style('body').color, style('body').backgroundColor],
        secondary: [style('.card-genre').color, style('body').backgroundColor],
        button: [style('.catalog-search button').color, style('.catalog-search button').backgroundColor],
        field: [style('#catalog-query').color, style('#catalog-query').backgroundColor],
        border: [style('#catalog-query').borderTopColor, style('#catalog-query').backgroundColor],
        focus: [style('#catalog-query').outlineColor, style('.catalog-search').backgroundColor]
      };
    }''')
    ratios = {name: contrast(*pair) for name, pair in colors.items()}
    assert all(value >= (3 if name in ['border', 'focus'] else 4.5) for name, value in ratios.items()), ratios
    ids = page.locator('svg [id]').evaluate_all('(nodes) => nodes.map(node => node.id)')
    assert len(ids) == len(set(ids))
    assert page.locator('svg image').count() == 0

    field = page.get_by_role('searchbox', name='Buscar obras')
    field.fill('ÓRBITA')
    page.get_by_role('combobox', name='Formato').select_option('manhwa')
    field.focus()
    field.press('Enter')
    expect(catalog()).to_have_count(1)
    expect(field).to_be_focused()
    assert 'q=%C3%93RBITA&format=manhwa' in page.url
    expect(catalog().first).to_have_attribute('href', '/obras/orbita-de-papel?q=%C3%93RBITA&format=manhwa')
    header_search.focus()
    page.keyboard.press('Enter')
    expect(field).to_have_value('ÓRBITA')
    expect(field).to_be_focused()
    catalog().first.click()
    expect(page.get_by_role('heading', level=1, name='Órbita de papel')).to_be_visible()
    page.go_back()
    expect(catalog()).to_have_count(1)
    page.go_forward()
    expect(page.get_by_role('heading', level=1, name='Órbita de papel')).to_be_visible()
    page.get_by_role('link', name=re.compile('Volver al catálogo')).click()
    expect(page.get_by_role('searchbox')).to_have_value('ÓRBITA')
    page.get_by_role('searchbox').fill('zzzz-no-result')
    page.get_by_role('button', name='Buscar', exact=False).click()
    expect(page.get_by_role('heading', name=re.compile('No encontramos obras'))).to_be_visible()
    screenshot('estado-vacio')
    page.get_by_role('button', name='Limpiar búsqueda').click()
    expect(catalog()).to_have_count(6)

    pending = []
    page.route('**/api/works', lambda route: pending.append(route))
    page.goto(base + '/explorar')
    expect(page.get_by_role('status')).to_have_text('Cargando catálogo…')
    screenshot('estado-cargando')
    assert pending
    with console.expect_network('/api/works', 'ERR_FAILED'):
        for route in pending:
            route.abort()
        expect(page.get_by_role('alert')).to_contain_text('No se pudo cargar el catálogo')
        screenshot('estado-error')
        page.unroute('**/api/works')
        page.get_by_role('button', name='Reintentar').click()
        expect(catalog()).to_have_count(6)

    for width in [1440, 768, 390, 320]:
        page.set_viewport_size({'width': width, 'height': 1000 if width > 400 else 844})
        page.goto(base + '/obras/despues-del-ultimo-tren?q=Aurora&format=manga')
        expect(page.get_by_role('heading', level=1, name='Después del último tren')).to_be_visible()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        expect(page.get_by_role('link', name=re.compile('Volver al catálogo'))).to_have_attribute('href', '/explorar?q=Aurora&format=manga')
        screenshot('ficha-' + str(width))
    page.get_by_role('link', name='Buscar en el catálogo').focus()
    page.keyboard.press('Enter')
    expect(page.get_by_role('searchbox')).to_be_focused()

    with console.expect_network('/api/works/no-existe', '404'):
        page.goto(base + '/obras/no-existe')
        expect(page.get_by_role('heading', name='No encontramos esta obra')).to_be_visible()
        screenshot('estado-obra-desconocida')
    page.goto(base + '/no-existe')
    expect(page.get_by_role('heading', name='Esta página no existe')).to_be_visible()
    with console.expect_network('/api/health', '503'):
        page.goto(base + '/estado')
        expect(page.get_by_role('alert')).to_contain_text('No se pudo comprobar la conexión')
        surface = page.locator('.catalog-shell').evaluate('(node) => getComputedStyle(node).getPropertyValue("--surface").trim()')
        actual_surface = page.locator('main').evaluate('(node) => getComputedStyle(node).backgroundColor')
        expected_surface = page.evaluate('''color => { const node=document.createElement('span');node.style.backgroundColor=color;
            document.body.append(node);const result=getComputedStyle(node).backgroundColor;node.remove();return result; }''', surface)
        assert actual_surface == expected_surface
        assert page.get_by_text('Backend y PostgreSQL disponibles').count() == 0
        page.get_by_role('button', name='Reintentar').click()
        expect(page.get_by_role('alert')).to_be_visible()
        screenshot('estado-conexion')

    reload_paths = [
        ('/', 'Archivo Aurora'),
        ('/explorar', 'Explorar el catálogo'),
        ('/explorar?q=%C3%93RBITA&format=manhwa', 'Explorar el catálogo'),
        ('/?q=%C3%93RBITA&format=manhwa', 'Explorar el catálogo'),
        ('/?format=manhwa', 'Explorar el catálogo'),
        ('/?q=&format=', 'Explorar el catálogo'),
        ('/obras/archivo-aurora?q=Aurora&format=manga', 'Archivo Aurora'),
        ('/no-existe', 'Esta página no existe'),
    ]
    for path, heading in reload_paths:
        assert page.goto(base + path).status == 200
        expect(page.get_by_role('heading', level=1, name=heading)).to_be_visible()
        assert page.reload().status == 200
        expect(page.get_by_role('heading', level=1, name=heading)).to_be_visible()
        if 'format=' in path and '/obras/' not in path:
            expect(page.get_by_role('combobox')).to_have_value('manhwa' if 'manhwa' in path else '')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    with console.expect_network('/api/health', '503'):
        page.goto(base + '/estado')
        page.reload()
        expect(page.get_by_role('alert')).to_be_visible()
    page.goto(base + '/#catalog-query')
    expect(page.get_by_role('searchbox')).to_be_focused()
    # Deterministic fault injection tests UI states only, never changes production data.
    pending_home = []
    page.route('**/api/works', lambda route: pending_home.append(route))
    page.goto(base + '/')
    expect(page.get_by_role('status')).to_have_text('Cargando catálogo…')
    assert catalog().count() == 0
    screenshot('inicio-cargando')
    assert pending_home
    with console.expect_network('/api/works', 'ERR_FAILED'):
        for route in pending_home:
            route.abort()
        expect(page.get_by_role('alert')).to_be_visible()
        screenshot('inicio-error')
        page.unroute('**/api/works')
        page.get_by_role('button', name='Reintentar').click()
        expect(catalog()).to_have_count(6)
    page.route('**/api/works', lambda route: route.fulfill(json={'source': {'kind': 'synthetic', 'persisted': False}, 'items': []}))
    page.goto(base + '/')
    expect(page.get_by_role('heading', name='Todavía no hay obras para explorar')).to_be_visible()
    assert catalog().count() == 0
    screenshot('inicio-vacio')
    page.unroute('**/api/works')
    page.get_by_role('button', name='Reintentar').click()
    expect(catalog()).to_have_count(6)

    page.emulate_media(reduced_motion='reduce')
    page.goto(base + '/explorar')
    expect(catalog()).to_have_count(6)
    catalog().first.hover()
    motion = page.locator('.work-cover').first.evaluate('(node) => {const s=getComputedStyle(node);return [s.transitionDuration,s.animationName,s.transform,s.scrollBehavior];}')
    assert motion == ['0s', 'none', 'none', 'auto'], motion
    assert not errors, errors
    assert not console['unexpected'], console['unexpected']
    assert not external, external
    report = {'home_viewports': home_viewports, 'direct_reload_paths': [path for path, _ in reload_paths] + ['/estado'], 'home_states_and_genres': 'passed', 'viewports': viewport_results, 'contrast': ratios, 'svg_gradient_ids': len(ids), 'keyboard_and_history': 'passed', 'loading_error_empty_retry_404_health503': 'passed', 'reduced_motion': motion, 'page_errors': errors, 'external_requests': external, 'console': console}
    (output / 'mediciones.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    browser.close()
