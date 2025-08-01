import React, { useState, useEffect } from 'react';
import styles from './AddTaskForm.module.scss';

interface AddTaskFormProps {
  initialTitle?: string;
  initialDescription?: string;
  onSubmit: (title: string, description: string) => void;
  onCancel?: () => void;
}

const AddTaskForm = ({
  initialTitle = '',
  initialDescription = '',
  onSubmit,
  onCancel,
}: AddTaskFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [initialTitle, initialDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Task description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div>
        <button type="submit">{initialTitle ? 'Save' : 'Add'}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddTaskForm;
