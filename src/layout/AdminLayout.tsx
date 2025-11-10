import { AdminUrls } from '@/@types/urlEnums/AdminUrl';
import AdminNavbar from '@/components/navbar/AdminNavbar';
import AdminSideNavBar from '@/components/navbar/AdminSideNavBar';
import { Outlet, useLocation } from 'react-router-dom';

function AdminLayout() {
  const { pathname } = useLocation();
  const routesWithoutNav = [AdminUrls.signIn]; // Define routes without navigation
  const hideNavbar = routesWithoutNav.some(route => pathname.startsWith(route)); // Check if current route requires no nav

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar at the top */}
      {!hideNavbar && <AdminNavbar />}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        {!hideNavbar && <AdminSideNavBar />}

        {/* Main content in the center */}
        <main className="flex-1 pt-7 rounded-xl dark:bg-black bg-gray-100 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
