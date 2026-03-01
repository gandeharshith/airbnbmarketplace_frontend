export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export function setAuthData(data: { access_token: string; user: User }) {
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

export function getUser(): User | null {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatRevenue(rev: number): string {
  if (rev >= 100000) return `₹${(rev / 100000).toFixed(1)}L`;
  return `₹${rev.toLocaleString('en-IN')}`;
}