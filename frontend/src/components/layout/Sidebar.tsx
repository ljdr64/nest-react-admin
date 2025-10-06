import { BookOpen, Home, LogOut, Users } from 'react-feather';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const history = useHistory();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  return (
    <div className={`sidebar ${className} text-white`}>
      <Link to="/" className="sidebar-title">
        <h1 className="sr-only">Carna Project</h1>
      </Link>

      <nav className="mt-20 flex flex-col gap-10 flex-grow">
        <SidebarItem to="/" className="sidebar-item">
          <Home /> Dashboard
        </SidebarItem>

        <SidebarItem to="/courses" className="sidebar-item">
          <BookOpen /> Courses
        </SidebarItem>

        {authenticatedUser.role === 'admin' && (
          <SidebarItem to="/users" className="sidebar-item">
            <Users /> Users
          </SidebarItem>
        )}
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        <LogOut /> Logout
      </button>
    </div>
  );
}
