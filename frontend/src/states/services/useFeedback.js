import { createResourceHook } from '@/hooks/useResource';
import { feedbacksApi } from '../api/feedbacks.api';
export default createResourceHook(feedbacksApi, 'Feedback');