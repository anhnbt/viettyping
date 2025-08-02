import React from 'react';
import Navigation from '@/components/Navigation';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {showNavigation && <Navigation />}
      {children}
    </main>
  );
};

export default Layout;
