import { IResponse } from '../../shared/types/IResponse';
import { ITask } from './ITask';

export type IGetTasksResponse = ITask | ITask[];
export type IGetUsersRestResponse = IResponse<ITask>;
