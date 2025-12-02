import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  Search,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const userNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Upload, label: "Upload & Analyze", path: "/dashboard/upload" },
  { icon: FolderOpen, label: "File Manager", path: "/dashboard/files" },
  { icon: Search, label: "Analysis Viewer", path: "/dashboard/analysis" },
];

const adminNavItems = [
  { icon: BarChart3, label: "Admin Dashboard", path: "/admin" },
  { icon: Users, label: "Manage Users", path: "/admin/users" },
  { icon: FolderOpen, label: "User Images", path: "/admin/images" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 h-screen glass-panel-strong border-r border-border/50 z-50 flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-cyber flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="font-bold text-lg gradient-text">ForgeGuard</h1>
              <p className="text-xs text-muted-foreground">AI Detection</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard" || item.path === "/admin"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-cyber text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )
            }
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <item.icon className="w-5 h-5" />
            </motion.div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className="font-medium"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border/50">
        {!isCollapsed && (
          <div className="mb-4 p-3 rounded-lg bg-muted/30">
            <p className="font-medium text-sm truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  );
};
