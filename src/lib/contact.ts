export type ContactPayload = { name: string; email: string; company?: string; message: string; locale: string; website?: string };
type Validation = { valid: boolean; errors: Record<string, string> };

export function validateContact(data: ContactPayload): Validation {
  const errors: Record<string, string> = {};
  if (data.name.trim().length < 2) errors.name = 'name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'email';
  if (data.message.trim().length < 12 || data.message.trim().length > 2000) errors.message = 'message';
  if (data.website?.trim()) errors.website = 'website';
  return { valid: Object.keys(errors).length === 0, errors };
}

export const contactEndpoint = (apiUrl?: string) => `${apiUrl?.replace(/\/$/, '') ?? ''}/api/quint/contact`;
