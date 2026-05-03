import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function DashboardLayout() {
  return (
    <div className="mesh-bg min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-6xl">
        <Sidebar />
        <main className="min-h-[calc(100vh-4rem)] flex-1 px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
