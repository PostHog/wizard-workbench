import axios from 'axios';
import { initPostHog } from './posthog';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

initPostHog();
