'use client';

import React from 'react';
import styles from './Header.module.scss';
import { useKanban } from '../hooks/useKanban';

const Header = () => {
  const { addColumn } = useKanban();

  const handleAddColumn = () => {
    addColumn();
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Kanban Board</h1>
      <button className={styles.addButton} onClick={handleAddColumn} title="Add Column">
        + Add column
      </button>
    </header>
  );
};

export default Header;
