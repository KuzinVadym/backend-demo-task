import { TaskStatus } from '../../../infrastructure/types';

export function validateStatusTransition(currentStatus, nextStatus): boolean {
  const allowedTransitions = {
    ToDo: [TaskStatus.ToDo, TaskStatus.InProgress],
    InProgress: [TaskStatus.InProgress, TaskStatus.Blocked, TaskStatus.InQA],
    Blocked: [TaskStatus.Blocked, TaskStatus.ToDo],
    InQA: [TaskStatus.InQA, TaskStatus.ToDo, TaskStatus.Done],
    Done: [TaskStatus.Done, TaskStatus.Deployed],
    Deployed: [TaskStatus.Deployed]
  };

  return allowedTransitions[currentStatus].includes(nextStatus);
}
