import React from 'react';
import styles from './Comments.module.scss';

interface CommentInputProps {
  commentText: string;
  setCommentText: (text: string) => void;
  onSave: () => void;
  disabled: boolean;
}

const CommentInput = ({ commentText, setCommentText, onSave, disabled }: CommentInputProps) => {
  return (
    <div className={styles.commentInputWrapper}>
      <textarea
        className={styles.commentInput}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
      />
      <div className={styles.commentButtons}>
        <button className={styles.commentSaveButton} onClick={onSave} disabled={disabled}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
