'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

interface AppShellProps {
  title?: string;
  action?: React.ReactNode; // right-aligned header action (e.g., New Meeting button)
  children: React.ReactNode;
}

export default function AppShell({ title, action, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const NavItem: React.FC<{ href: string; label: string }> = ({ href, label }) => {
    const active = pathname?.startsWith(href);
    return (
      <Link
        href={href}
        className={`block px-3 py-2 rounded-md text-sm font-medium ${
          active ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {label}
      </Link>
    );
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="flex items-center gap-2 text-xl font-semibold mb-6">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">M</span>
            <span>Meeting Insights Analyzer</span>
          </div>
          <nav className="space-y-1">
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/settings" label="Settings" />
          </nav>
          <div className="mt-auto fixed bottom-4 w-56">
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm">
              <div className="font-medium truncate">{session?.user?.email || 'User'}</div>
              <div className="mt-2 flex gap-2">
                <button
                  className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 hover:bg-gray-100"
                  onClick={() => router.push('/profile')}
                >
                  Profile
                </button>
                <button
                  className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 hover:bg-gray-100"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
              <div className="md:hidden font-semibold">MIA</div>
              <div>
                <h1 className="text-lg md:text-xl font-semibold">{title || 'Dashboard'}</h1>
              </div>
              <div className="flex items-center gap-3">
                {action}
              </div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
