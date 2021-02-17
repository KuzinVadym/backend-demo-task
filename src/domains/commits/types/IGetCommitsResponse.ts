import { IResponse } from '../../shared/types/IResponse';
import { ICommit } from './ICommit';

export type IGetCommitsResponse = ICommit | ICommit[];
export type IGetCommitsRestResponse = IResponse<ICommit>;
