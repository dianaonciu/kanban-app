import React from 'react';
import styles from './Comments.module.scss';
import { IComment } from '../types';

interface CommentListProps {
  comments: IComment[];
  columnId: string;
  taskId: string;
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
  editText: string;
  setEditText: (val: string) => void;
  editComment: (colId: string, taskId: string, commentId: string, newText: string) => void;
  deleteComment: (colId: string, taskId: string, commentId: string) => void;
  clearInputs: () => void;
}

const CommentList = ({
  comments,
  columnId,
  taskId,
  editingCommentId,
  setEditingCommentId,
  editText,
  setEditText,
  editComment,
  deleteComment,
  clearInputs,
}: CommentListProps) => {
  if (!comments.length) {
    return <div className={styles.empty}>No comments yet</div>;
  }

  return (
    <div className={styles.commentsList}>
      {comments.map((comment) => (
        <div key={comment.id} className={styles.commentItem}>
          {editingCommentId === comment.id ? (
            <div className={styles.commentEditWrapper}>
              <textarea
                className={styles.commentInput}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div className={styles.commentButtons}>
                <button
                  className={styles.commentSaveButton}
                  onClick={() => {
                    if (editText.trim()) {
                      editComment(columnId, taskId, comment.id, editText.trim());
                      clearInputs();
                    }
                  }}
                  disabled={!editText.trim()}
                >
                  Save
                </button>
                <button className={styles.commentCancelButton} onClick={clearInputs}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.commentDisplay}>
              <span>{comment.content}</span>
              <button
                className={styles.editButton}
                onClick={() => {
                  setEditText(comment.content);
                  setEditingCommentId(comment.id);
                }}
              >
                ✎
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => deleteComment(columnId, taskId, comment.id)}
              >
                🗑
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
