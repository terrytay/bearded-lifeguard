"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import PageTransition from '@/components/PageTransition';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes - no header/footer, no page transition
    return <>{children}</>;
  }

  // Regular routes - with header/footer and page transition
  return (
    <>
      <Header />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </>
  );
}