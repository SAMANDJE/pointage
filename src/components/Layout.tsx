import { Outlet } from 'react-router-dom';
import { SidebarNav } from '@/components/SidebarNav';
import { MobileNav } from '@/components/MobileNav';
import { Toaster } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';
export function Layout() {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {isMobile ? (
        <>
          <MobileNav />
          <main>
            <div className="p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>
          </main>
        </>
      ) : (
        <div className="flex">
          <SidebarNav />
          <main className="flex-1">
            <div className="p-6 md:p-8">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      )}
      <Toaster richColors position="top-right" />
    </div>
  );
}