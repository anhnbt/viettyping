import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname.startsWith('/subjects');
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-center gap-4 mb-8">
        <Link
          href="/"
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isActive('/')
              ? 'bg-blue-500 text-white'
              : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
          }`}
        >
          📚 Học các môn
        </Link>
        <Link
          href="/typing"
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isActive('/typing')
              ? 'bg-blue-500 text-white'
              : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
          }`}
        >
          ⌨️ Luyện gõ phím
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
