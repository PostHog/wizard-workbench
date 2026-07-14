import axios from 'axios';
import store from '../store';
import posthog from './posthog';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3333/',
});

api.interceptors.request.use(config => {
  const { token } = store.getState().auth;
  const { active: team } = store.getState().teams;

  const headers = { ...config.headers };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const distinctId = posthog.get_distinct_id();

  if (distinctId) {
    headers['X-POSTHOG-DISTINCT-ID'] = distinctId;
  }

  if (team) {
    headers.TEAM = team.slug;
  }

  return { ...config, headers };
});

export default api;
