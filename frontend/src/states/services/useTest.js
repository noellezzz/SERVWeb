import { createResourceHook } from '@/hooks/useResource';
import { testsApi } from '../api/tests.api';
export default createResourceHook(testsApi, 'Test');