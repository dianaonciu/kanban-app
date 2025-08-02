'use client';

import React, { useState } from 'react';
import styles from './TaskCard.module.scss';
import { ITask } from '../types';
import { useKanban } from '../hooks/useKanban';
import AddTaskForm from './AddTaskForm';
import Modal from '../Modal/Modal';
import CommentList from '../Comments/CommentList';
import CommentInput from '../Comments/CommentInput';
import { v4 as uuidv4 } from 'uuid';

interface TaskCardProps {
  task: ITask;
  columnId: string;
}

const TaskCard = ({ task, columnId }: TaskCardProps) => {
  const { editTask, deleteTask, addComment, editComment, deleteComment } = useKanban();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('fromColumnId', columnId);
  };

  const handleEditSubmit = (title: string, description: string) => {
    editTask(columnId, task.id, { title, description });
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this card?');
    if (confirmed) {
      deleteTask(columnId, task.id);
      setIsModalOpen(false);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: uuidv4(),
      content: commentText.trim(),
    };
    addComment(columnId, task.id, newComment);
    setCommentText('');
  };

  const clearInputs = () => {
    setEditingCommentId(null);
    setEditText('');
    setCommentText('');
  };

  return (
    <>
      <div
        className={styles.taskCard}
        draggable
        onDragStart={handleDragStart}
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
        aria-label={`Open details for task: ${task.title}`}
      >
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <div className={styles.taskTitle}>{task.title}</div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.editButton}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setIsModalOpen(true);
              }}
              aria-label="Edit task"
            >
              ✎
            </button>
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              aria-label="Delete task"
            >
              🗑
            </button>
          </div>
        </div>
        <div className={`${styles.description} ${!task.description ? styles.empty : ''}`}>
          {task.description || 'No description'}
        </div>
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
            setIsEditing(false);
            clearInputs();
          }}
        >
          {isEditing ? (
            <AddTaskForm
              initialTitle={task.title}
              initialDescription={task.description}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <h2>{task.title}</h2>
              <div className={`${styles.description} ${!task.description ? styles.empty : ''}`}>
                {task.description || 'No description'}
              </div>
              <section className={styles.commentsSection}>
                <h3>Comments</h3>

                <CommentList
                  comments={task.comments || []}
                  columnId={columnId}
                  taskId={task.id}
                  editingCommentId={editingCommentId}
                  setEditingCommentId={setEditingCommentId}
                  editText={editText}
                  setEditText={setEditText}
                  editComment={editComment}
                  deleteComment={deleteComment}
                  clearInputs={clearInputs}
                />

                {!editingCommentId && (
                  <CommentInput
                    commentText={commentText}
                    setCommentText={setCommentText}
                    onSave={handleAddComment}
                    disabled={!commentText.trim()}
                  />
                )}
              </section>
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default TaskCard;
