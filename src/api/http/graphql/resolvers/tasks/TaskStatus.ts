import { registerEnumType } from 'type-graphql';

export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Blocked = 'Blocked',
  InQA = 'InQA',
  Done = 'Done',
  Deployed = 'Deployed'
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus'
});
