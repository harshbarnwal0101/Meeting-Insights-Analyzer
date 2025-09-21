'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName, orgName, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Signup failed');
        return;
      }
      router.push('/login');
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
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
            Create your account
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-6 text-xl font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">M</span>
          <span>Meeting Insights Analyzer</span>
        </div>

        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-center gap-10 text-sm border-b border-gray-200">
            <Link href="/login" className="px-6 py-3 text-gray-500 hover:text-gray-700">Sign In</Link>
            <div className="px-6 py-3 font-medium text-indigo-600">Sign Up</div>
          </div>
          <div className="p-6">
            <h1 className="text-xl font-semibold mb-1">Create an Account</h1>
            <p className="text-sm text-gray-500 mb-6">Enter your information to get started</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input
                  className="w-full bg-gray-50 border border-gray-300 rounded-md p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Organization</label>
                <input
                  className="w-full bg-gray-50 border border-gray-300 rounded-md p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Company / Team"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-300 rounded-md p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full bg-gray-50 border border-gray-300 rounded-md p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Role</label>
                <select
                  className="w-full bg-gray-50 border border-gray-300 rounded-md p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-md transition disabled:bg-gray-400"
              >
                {loading ? 'Creating account…' : 'Create an account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
