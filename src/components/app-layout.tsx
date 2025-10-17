'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { useAppContext } from '@/contexts/app-context';
import LoginPage from '@/app/login/page';
import { StudentDetailsForm } from '@/components/student-details-form';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isClient, student } = useAppContext();
  
  if (!isClient) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (!student) {
    return <StudentDetailsForm />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarNav />
        <div className="flex-1">
          <SidebarInset>
            <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
