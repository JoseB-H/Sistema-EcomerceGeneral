import unittest
from types import SimpleNamespace
from console_checks import capture_console


class Page:
    def on(self, event, listener):
        assert event == 'console'
        self.receive = listener

    def resource(self, path, code='503'):
        text = ('Failed to load resource: net::' + code if code.startswith('ERR_')
                else 'Failed to load resource: the server responded with a status of ' + code)
        self.receive(SimpleNamespace(type='error', text=text, location={'url': 'http://localhost:5173' + path}))


class ConsoleChecksTest(unittest.TestCase):
    def test_unexpected_api_503_is_not_an_expected_test_failure(self):
        page = Page()
        result = capture_console(page)
        page.resource('/api/unexpected-request')
        self.assertEqual(len(result['unexpected']), 1)
        self.assertEqual(result['expected_network_errors'], {})

    def test_only_active_endpoint_and_status_are_expected(self):
        page = Page()
        result = capture_console(page)
        page.resource('/api/health')
        with result.expect_network('/api/health', '503'):
            page.resource('/api/health')
            page.resource('/api/works')
            page.resource('/api/health', '404')
        self.assertEqual(result['expected_network_errors'], {'503': 1})
        self.assertEqual(len(result['unexpected']), 3)

    def test_scope_expires_after_a_fixture_raises(self):
        page = Page()
        result = capture_console(page)
        with self.assertRaises(RuntimeError):
            with result.expect_network('/api/works', 'ERR_FAILED'):
                page.resource('/api/works', 'ERR_FAILED')
                raise RuntimeError('fixture finished')
        page.resource('/api/works', 'ERR_FAILED')
        self.assertEqual(result['expected_network_errors'], {'ERR_FAILED': 1})
        self.assertEqual(len(result['unexpected']), 1)

    def test_nested_scopes_do_not_cancel_the_outer_expectation(self):
        page = Page()
        result = capture_console(page)
        with result.expect_network('/api/health', '503'):
            with result.expect_network('/api/health', '503'):
                page.resource('/api/health')
            page.resource('/api/health')
        page.resource('/api/health')
        self.assertEqual(result['expected_network_errors'], {'503': 2})
        self.assertEqual(len(result['unexpected']), 1)

    def test_application_errors_and_warnings_are_never_network_exceptions(self):
        page = Page()
        result = capture_console(page)
        with result.expect_network('/api/health', '503'):
            for kind in ['error', 'warning']:
                page.receive(SimpleNamespace(type=kind, text='Application problem', location={'url': 'http://localhost:5173/api/health'}))
        self.assertEqual(result['expected_network_errors'], {})
        self.assertEqual(len(result['unexpected']), 2)

    def test_missing_default_favicon_is_reported_separately_without_allowing_other_errors(self):
        page = Page()
        result = capture_console(page)
        page.resource('/favicon.ico', '404')
        page.resource('/api/unexpected-request', '404')
        page.resource('/favicon.ico', '503')
        self.assertEqual(result.get('expected_browser_errors'), {'favicon.ico:404': 1})
        self.assertEqual(len(result['unexpected']), 2)


if __name__ == '__main__':
    unittest.main()
