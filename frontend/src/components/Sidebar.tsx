import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import {
  ShoppingBag,
  Plus,
  Settings,
  HelpCircle,
  Bell,
  User,
  LogOut,
  CreditCard
} from "lucide-react";
import axios from 'axios';
import Studio from '../pages/Studio';

interface SidebarButtonProps {
  icon: React.ElementType;
  isActive: boolean;
  href: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = React.memo(({ icon: Icon, isActive, href }) => (
  <Link to={href} className="flex justify-center">
    <button className={cn(
      "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
      isActive 
        ? "bg-apple-blue text-white shadow-md" 
        : "text-apple-gray hover:bg-apple-light-gray hover:text-apple-blue"
    )}>
      <Icon className="h-5 w-5" />
    </button>
  </Link>
));

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: '', email: '' });
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData({
          username: response.data.username,
          email: response.data.email
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="relative">
      <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center h-screen py-4">
        <nav className="flex flex-col space-y-3">
          <SidebarButton 
            icon={ShoppingBag} 
            isActive={location.pathname === "/marketplace"} 
            href="/marketplace" 
          />
          {/* <SidebarButton 
            icon={LayoutDashboard} 
            isActive={location.pathname === "/dashboard"} 
            href="/dashboard" 
          /> */}
          <button
            onClick={() => setIsStudioOpen(true)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200",
              location.pathname === "/studio"
                ? "bg-purple-100 text-purple-600 shadow-inner"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            )}
          >
            <Plus className="h-5 w-5" />
          </button>
        </nav>
        <div className="mt-auto flex flex-col space-y-3">
          <SidebarButton 
            icon={Settings} 
            isActive={location.pathname === "/settings"} 
            href="/settings" 
          />
          <SidebarButton 
            icon={HelpCircle} 
            isActive={location.pathname === "/help"} 
            href="/help" 
          />
          <SidebarButton 
            icon={Bell} 
            isActive={location.pathname === "/notifications"} 
            href="/notifications" 
          />
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
          >
            {userData.username ? userData.username.substring(0, 2).toUpperCase() : 'XU'}
          </button>
        </div>
      </aside>
      {isStudioOpen && <Studio onClose={() => setIsStudioOpen(false)} />}
      {isUserMenuOpen && (
        <div className="fixed left-16 bottom-0 w-64 bg-white border border-gray-200 rounded-tr-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {userData.username ? userData.username.substring(0, 2).toUpperCase() : 'XU'}
              </div>
              <div>
                <p className="font-medium">{userData.username || 'User'}</p>
                <p className="text-sm text-gray-500">{userData.email || 'user@example.com'}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Link to="/profile" className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </button>
              <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded flex items-center text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Sidebar);