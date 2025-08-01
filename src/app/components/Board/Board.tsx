'use client';

import React from 'react';
import styles from './Board.module.scss';
import Column from '../Column/Column';
import { useKanban } from '../hooks/useKanban';

const Board = () => {
  const { state } = useKanban();

  return (
    <div className={styles.board}>
      {state.columns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
    </div>
  );
};

export default Board;
