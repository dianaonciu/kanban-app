'use client';

import React, { useState } from 'react';
import styles from './Comments.module.scss';
import { IComment } from '../types';
import { useKanban } from '../hooks/useKanban';
import { v4 as uuidv4 } from 'uuid';

interface CommentListProps {
  comments: IComment[];
  columnId: string;
  taskId: string;
  parentId?: string;
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
  parentId,
  editingCommentId,
  setEditingCommentId,
  editText,
  setEditText,
  editComment,
  deleteComment,
  clearInputs,
}: CommentListProps) => {
  const { addReply } = useKanban();

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [collapsedComments, setCollapsedComments] = useState<Record<string, boolean>>({});

  const toggleCollapse = (commentId: string) => {
    setCollapsedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplySubmit = (commentId: string) => {
    if (!replyText.trim()) return;
    addReply(columnId, taskId, commentId, {
      id: uuidv4(),
      content: replyText.trim(),
      replies: [],
    });
    setReplyText('');
    setActiveReplyId(null);
  };

  if (!comments.length && !parentId) {
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
            <div
              className={styles.commentDisplay}
              onClick={(e) => {
                if ((e.target as HTMLElement).tagName === 'BUTTON') return;
                toggleCollapse(comment.id);
              }}
            >
              <div className={styles.content}>{comment.content}</div>
              <div className={styles.commentActions}>
                <button onClick={() => setActiveReplyId(comment.id)}>↩</button>
                <button
                  onClick={() => {
                    setEditText(comment.content);
                    setEditingCommentId(comment.id);
                  }}
                >
                  ✎
                </button>
                <button onClick={() => deleteComment(columnId, taskId, comment.id)}>🗑</button>
              </div>
            </div>
          )}

          {activeReplyId === comment.id && (
            <div className={styles.replyBox}>
              <textarea
                className={styles.commentInput}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
              />
              <div className={styles.commentButtons}>
                <button
                  className={styles.commentSaveButton}
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={!replyText.trim()}
                >
                  Reply
                </button>
                <button
                  className={styles.commentCancelButton}
                  onClick={() => {
                    setReplyText('');
                    setActiveReplyId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && !collapsedComments[comment.id] && (
            <div className={styles.subcomments}>
              <CommentList
                comments={comment.replies}
                columnId={columnId}
                taskId={taskId}
                parentId={comment.id}
                editingCommentId={editingCommentId}
                setEditingCommentId={setEditingCommentId}
                editText={editText}
                setEditText={setEditText}
                editComment={editComment}
                deleteComment={deleteComment}
                clearInputs={clearInputs}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
  {
  }
};

export default CommentList;
