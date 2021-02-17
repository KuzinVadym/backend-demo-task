import { TaskEntity } from './TaskEntity';
import { UserEntity } from './UserEntity';
import { CommitEntity } from './CommitEntity';

export function initOrmEntities() {
  return [TaskEntity, UserEntity, CommitEntity];
}
