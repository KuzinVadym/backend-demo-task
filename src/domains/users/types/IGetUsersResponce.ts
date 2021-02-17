import { IResponse } from '../../shared/types/IResponse';
import { IUser } from './IUser';

export type IGetUsersResponse = IUser | IUser[];
export type IGetUsersRestResponse = IResponse<IUser>;
