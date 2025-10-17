'use client';

import { AppProvider } from '@/contexts/app-context';
import { AppLayout } from '@/components/app-layout';
import { Toaster } from '@/components/ui/toaster';

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppLayout>{children}</AppLayout>
      <Toaster />
    </AppProvider>
  );
}
