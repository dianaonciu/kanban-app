'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './Column.module.scss';
import TaskCard from '../TaskCard/TaskCard';
import { IColumn } from '../types';
import { useKanban } from '../hooks/useKanban';
import AddTaskForm from '../TaskCard/AddTaskForm';
import Modal from '../Modal/Modal';

interface ColumnProps {
  column: IColumn;
}

const Column = ({ column }: ColumnProps) => {
  const { moveTask, renameColumn, deleteColumn, addTask } = useKanban();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [addingTask, setAddingTask] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [tasks, setTasks] = useState(column.tasks);

  useEffect(() => {
    setTasks(column.tasks);
  }, [column.tasks]);

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(index, 0, draggedTask);

    setDraggedIndex(index);
    setTasks(newTasks);
  };

  const handleDrop = (e: React.DragEvent) => {
    const taskId = e.dataTransfer.getData('taskId');
    const fromColumnId = e.dataTransfer.getData('fromColumnId');

    if (taskId && fromColumnId && fromColumnId !== column.id) {
      moveTask(taskId, fromColumnId, column.id);
    }
  };

  const handleRename = () => {
    const updateTitle = newTitle.trim() || column.title;
    renameColumn(column.id, updateTitle);
    setEditingTitle(false);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this column?');
    if (confirmed) {
      deleteColumn(column.id);
      setMenuOpen(false);
    }
  };

  const onAddTask = (title: string, description: string) => {
    addTask(column.id, {
      id: String(Date.now()),
      title,
      description,
    });
    setAddingTask(false);
  };

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className={styles.column} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <div className={styles.columnHeader}>
        {editingTitle ? (
          <input
            className={styles.titleInput}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            autoFocus
          />
        ) : (
          <h2 className={styles.title}>{column.title}</h2>
        )}
        <div className={styles.menuWrapper} ref={menuRef}>
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Column options"
          >
            ⋮
          </button>
          {menuOpen && (
            <div className={styles.menu}>
              <button onClick={() => setEditingTitle(true)}>Rename</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>

      {tasks.map((task, index) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
        >
          <TaskCard task={task} columnId={column.id} />
        </div>
      ))}

      <button className={styles.addTaskButton} onClick={() => setAddingTask((v) => !v)}>
        ＋ Add Task
      </button>

      {addingTask && (
        <Modal onClose={() => setAddingTask(false)}>
          <AddTaskForm onSubmit={onAddTask} onCancel={() => setAddingTask(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Column;
