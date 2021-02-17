import { IServices } from './shared/interfaces/IServices';
import { createUsersHttpService } from './users/services/http';
import { createTasksHttpService } from './tasks/services/http';
import { createCommitsHttpService } from './commits/services/http';

export function createHttpServices(): IServices {
  return {
    users: createUsersHttpService(),
    tasks: createTasksHttpService(),
    commits: createCommitsHttpService()
  };
}
