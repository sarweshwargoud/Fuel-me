import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg-page">
      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        {children}
      </main>
    </div>
  );
}
