import { useContext } from 'react';
import type { ITask, IComment } from '../types';
import { KanbanContext, KanbanState } from '../contexts/KanbanContext';

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  const { state, dispatch } = context;

  const addColumn = () => dispatch({ type: 'ADD_COLUMN' });

  const renameColumn = (columnId: string, newTitle: string) =>
    dispatch({ type: 'RENAME_COLUMN', columnId, newTitle });

  const deleteColumn = (columnId: string) => dispatch({ type: 'DELETE_COLUMN', columnId });

  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string) =>
    dispatch({ type: 'MOVE_TASK', taskId, fromColumnId, toColumnId });

  const addTask = (columnId: string, task: ITask) => dispatch({ type: 'ADD_TASK', columnId, task });

  const editTask = (columnId: string, taskId: string, updatedFields: Partial<ITask>) =>
    dispatch({ type: 'EDIT_TASK', payload: { columnId, taskId, updatedFields } });

  const deleteTask = (columnId: string, taskId: string) =>
    dispatch({ type: 'DELETE_TASK', columnId, taskId });

  const addComment = (columnId: string, taskId: string, comment: IComment) =>
    dispatch({ type: 'ADD_COMMENT', columnId, taskId, comment });

  const editComment = (columnId: string, taskId: string, commentId: string, content: string) =>
    dispatch({ type: 'EDIT_COMMENT', columnId, taskId, commentId, content });

  const deleteComment = (columnId: string, taskId: string, commentId: string) =>
    dispatch({ type: 'DELETE_COMMENT', columnId, taskId, commentId });

  const addReply = (columnId: string, taskId: string, parentCommentId: string, reply: IComment) =>
    dispatch({
      type: 'ADD_REPLY',
      columnId,
      taskId,
      parentCommentId,
      reply,
    });

  return {
    state,
    addColumn,
    renameColumn,
    deleteColumn,
    moveTask,
    addTask,
    editTask,
    deleteTask,
    addComment,
    editComment,
    deleteComment,
    addReply,
  };
};
