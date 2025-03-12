import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { SocialIcon } from "@/components/ui/social-icon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard,
  Calendar,
  Send,
  BarChart,
  Link2, 
  Settings,
  Menu,
  X
} from "lucide-react";
import type { SocialAccount } from "@shared/schema";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: accounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ['/api/accounts'],
  });

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="mr-3 text-lg" /> },
    { path: "/schedule", label: "Schedule", icon: <Calendar className="mr-3 text-lg" /> },
    { path: "/posts", label: "Posts", icon: <Send className="mr-3 text-lg" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart className="mr-3 text-lg" /> },
    { path: "/connections", label: "Connections", icon: <Link2 className="mr-3 text-lg" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="mr-3 text-lg" /> },
  ];

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-gray-800 z-10">
        <div className="flex items-center justify-between h-16 px-4">
          <span className="text-xl font-semibold text-white">SocialSync</span>
          <button 
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <div className={cn("fixed inset-0 z-40", mobileOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}></div>
        <div className="relative flex flex-col w-80 max-w-xs bg-gray-800">
          <div className="absolute top-0 right-0 pt-2 pr-2">
            <button onClick={toggleMobileMenu} className="text-gray-300 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center h-16 px-4 border-b border-gray-700">
            <span className="text-xl font-semibold text-white">SocialSync</span>
          </div>
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path}
                  onClick={toggleMobileMenu}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    location === item.path 
                      ? "text-white bg-gray-900" 
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div id="sidebar" className={cn("hidden md:flex md:flex-shrink-0", className)}>
        <div className="flex flex-col w-64 bg-gray-800">
          <div className="flex items-center h-16 px-4 border-b border-gray-700">
            <span className="text-xl font-semibold text-white">SocialSync</span>
          </div>
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    location === item.path 
                      ? "text-white bg-gray-900" 
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 mt-6">
              <div className="px-4 py-3 rounded-md bg-gray-700">
                <h3 className="text-sm font-medium text-white">Connected Accounts</h3>
                <div className="mt-3 flex space-x-2">
                  {accounts.map(account => (
                    <SocialIcon 
                      key={account.id}
                      platform={account.platform}
                      className="text-xl"
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 w-full text-xs font-medium text-white bg-gray-600 hover:bg-gray-500"
                  asChild
                >
                  <Link href="/connections">Manage Connections</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-300">
                  {user?.avatarUrl && (
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={user.avatarUrl} 
                      alt={`${user.fullName}'s avatar`} 
                    />
                  )}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.fullName || 'User'}</p>
                <p className="text-xs font-medium text-gray-400">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
