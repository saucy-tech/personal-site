/** @jest-environment node */
import { logApiEvent, logStructured } from './logger';

afterEach(() => jest.restoreAllMocks());

it('retains event and status while dropping private provider and request data', () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  logApiEvent('error', '/api/subscribe', 'kit_create_subscriber_error', {
    status: 422,
    responseData: { email: 'private@example.com', apiKey: 'secret' },
    message: 'request failed with secret',
    ip: '192.0.2.1',
  });
  expect(JSON.parse(error.mock.calls[0][0])).toEqual({
    ts: expect.any(String), level: 'error', event: 'kit_create_subscriber_error',
    endpoint: '/api/subscribe', status: 422,
  });
});

it('keeps security event counts without retaining client identifiers', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  logStructured('warn', 'security_rate_limit_exceeded', {
    endpoint: '/api/invoice', ip: '192.0.2.1', userAgent: 'private',
  });
  expect(JSON.parse(warn.mock.calls[0][0])).toEqual({
    ts: expect.any(String), level: 'warn', event: 'security_rate_limit_exceeded',
    endpoint: '/api/invoice',
  });
});
