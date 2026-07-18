import { describe, expect, it } from 'vitest';
import { contactEndpoint, validateContact } from '../../src/lib/contact';

describe('contact validation', () => {
  const valid = { name: 'Ada Lovelace', email: 'ada@example.com', company: 'Quint', message: 'I would like a product consultation.', locale: 'en', website: '' };
  it('accepts a complete human submission', () => expect(validateContact(valid)).toEqual({ valid: true, errors: {} }));
  it('rejects a missing name', () => expect(validateContact({ ...valid, name: ' ' }).errors.name).toBe('name'));
  it('rejects invalid or incomplete fields', () => {
    expect(validateContact({ ...valid, email: 'not-an-email', message: 'short' })).toEqual({ valid: false, errors: { email: 'email', message: 'message' } });
  });
  it('silently traps automated honeypot submissions', () => expect(validateContact({ ...valid, website: 'bot' }).errors.website).toBe('website'));
  it('uses a relative API endpoint unless an explicit URL is configured', () => expect(contactEndpoint(undefined)).toBe('/api/quint/contact'));
  it('normalizes a configured API endpoint', () => expect(contactEndpoint('http://localhost:8090/')).toBe('http://localhost:8090/api/quint/contact'));
});
