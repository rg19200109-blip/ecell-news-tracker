const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Request failed');
  }

  return response.json();
};

export const fetchNews = (params) => {
  const query = new URLSearchParams(params).toString();
  return request(`/news${query ? `?${query}` : ''}`);
};

export const fetchAnalytics = () => request('/news/analytics/summary');
export const fetchMonthlyReport = (month) => request(`/news/reports/monthly?month=${encodeURIComponent(month)}`);
export const triggerNewsFetch = () => request('/news/fetch', { method: 'POST' });
export const subscribe = (email) => request('/subscriptions', {
  method: 'POST',
  body: JSON.stringify({ email })
});
