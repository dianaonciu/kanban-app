export interface IComment {
  id: string;
  content: string;
  replies?: IComment[];
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  comments?: IComment[];
}

export interface IColumn {
  id: string;
  title: string;
  tasks: ITask[];
}
