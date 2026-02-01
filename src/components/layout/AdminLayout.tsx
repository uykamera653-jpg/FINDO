import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AdminLayout({ children }: { children: ReactNode }) {

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
