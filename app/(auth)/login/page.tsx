'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-white text-gray-900">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md px-6">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
            Welcome back
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-6 text-xl font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">M</span>
          <span>Meeting Insights Analyzer</span>
        </div>

        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-center gap-10 text-sm border-b border-gray-200">
            <div className="px-6 py-3 font-medium text-indigo-600">Sign In</div>
            <Link href="/signup" className="px-6 py-3 text-gray-500 hover:text-gray-700">Sign Up</Link>
          </div>
          <div className="p-6">
            <h1 className="text-xl font-semibold mb-1">Welcome Back</h1>
            <p className="text-sm text-gray-500 mb-6">Enter your credentials to access your dashboard</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="m@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-md transition"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
