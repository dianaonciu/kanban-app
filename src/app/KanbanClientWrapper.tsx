'use client';
import { Suspense, useEffect, useState } from 'react';

import Board from './components/Board/Board';
import { KanbanProvider } from './components/contexts/KanbanContext';
import Header from './components/Header/Header';
const Loading = () => <div>Loading Kanban...</div>;

const KanbanApp = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <Loading />;
  }

  return <KanbanProvider>{children}</KanbanProvider>;
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <KanbanApp>
        <KanbanProvider>
          <Header />
          <Board />
          <div id="modal-root" />
        </KanbanProvider>{' '}
      </KanbanApp>
    </Suspense>
  );
}
