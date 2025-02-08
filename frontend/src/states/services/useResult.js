import { createResourceHook } from '@/hooks/useResource';
import { resultsApi } from '../api/results.api';
export default createResourceHook(resultsApi, 'Result');