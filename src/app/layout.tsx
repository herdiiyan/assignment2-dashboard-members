import type { Metadata } from 'next';
import './globals.css'
import { Header } from '@/shared/organisms/header';

export const metadata: Metadata = {
  title: 'Members Directory | Dashboard',
  description: 'Manage your organization team members, cross-functional roles, and workspace access levels.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
