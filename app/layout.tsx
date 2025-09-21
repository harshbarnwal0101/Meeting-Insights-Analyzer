import type { Metadata } from 'next';
import React from 'react';
import { Inter } from 'next/font/google';
import './../styles/globals.css';
import AuthProvider from './context/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meeting Analyzer',
  description: 'Analyze your meeting transcripts with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}> 
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
