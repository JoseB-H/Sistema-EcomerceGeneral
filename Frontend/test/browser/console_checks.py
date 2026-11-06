"""Observe console failures; only an active fixture may allow an exact API error."""
import re
from contextlib import contextmanager
from collections import Counter
from urllib.parse import urlsplit


class ConsoleResult(dict):
    def __init__(self):
        super().__init__(expected_network_errors={}, expected_browser_errors={}, unexpected=[])
        self._active = Counter()

    @contextmanager
    def expect_network(self, path, code):
        key = (path, str(code))
        self._active[key] += 1
        try:
            yield
        finally:
            self._active[key] -= 1
            if not self._active[key]:
                del self._active[key]


def capture_console(page):
    result = ConsoleResult()

    def receive(message):
        if message.type not in ['error', 'warning']:
            return
        location = message.location
        path = urlsplit(location.get('url', '')).path
        failure = re.search(r'(?:status of (\d{3})|net::(ERR_[A-Z_]+))', message.text)
        code = next((value for value in failure.groups() if value), None) if failure else None
        resource_error = message.type == 'error' and message.text.startswith('Failed to load resource:')
        if resource_error and path == '/favicon.ico' and code == '404':
            key = 'favicon.ico:404'
            result['expected_browser_errors'][key] = result['expected_browser_errors'].get(key, 0) + 1
        elif resource_error and result._active[(path, code)]:
            result['expected_network_errors'][code] = result['expected_network_errors'].get(code, 0) + 1
        else:
            result['unexpected'].append({'type': message.type, 'text': message.text, 'location': location})

    page.on('console', receive)
    return result
