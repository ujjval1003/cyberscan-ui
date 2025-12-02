import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CyberButton } from "@/components/ui/CyberButton";
import { api, User } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  Trash2,
  Eye,
  Download,
  Search,
  Loader2,
  Mail,
  Calendar,
  Image,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New user form
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await api.getUsers();
      setUsers(result.users);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // Mock data
      setUsers([
        { id: "1", email: "admin@example.com", name: "Admin User", role: "admin", created_at: new Date().toISOString(), image_count: 45 },
        { id: "2", email: "john@example.com", name: "John Doe", role: "user", created_at: new Date().toISOString(), image_count: 23 },
        { id: "3", email: "jane@example.com", name: "Jane Smith", role: "employee", created_at: new Date().toISOString(), image_count: 67 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setIsCreating(true);
    try {
      const user = await api.createUser(newUser);
      setUsers([...users, user]);
      setCreateDialogOpen(false);
      setNewUser({ email: "", password: "", name: "", role: "user" });
      toast({
        title: "User Created",
        description: "New user has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setDeletingId(id);
    try {
      await api.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      await api.downloadUserData(id);
      toast({
        title: "Download Started",
        description: "User data download has started.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: "bg-primary/20 text-primary",
      employee: "bg-accent/20 text-accent",
      user: "bg-secondary/20 text-secondary",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role as keyof typeof styles] || styles.user}`}>
        {role}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Manage Users</h1>
          <p className="text-muted-foreground text-lg">
            View and manage system users
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <CyberButton>
              <UserPlus className="w-5 h-5" />
              Create User
            </CyberButton>
          </DialogTrigger>
          <DialogContent className="glass-panel border-border/50">
            <DialogHeader>
              <DialogTitle className="gradient-text">Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Full name"
                  className="bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Email address"
                  className="bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Password"
                  className="bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger className="bg-muted/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <CyberButton variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </CyberButton>
              <CyberButton onClick={handleCreateUser} isLoading={isCreating}>
                Create User
              </CyberButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <GlassCard className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border/50"
          />
        </div>
      </GlassCard>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-semibold text-muted-foreground">User</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Role</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Images</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Joined</th>
                  <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-cyber flex items-center justify-center">
                            {user.role === "admin" ? (
                              <Shield className="w-5 h-5 text-primary-foreground" />
                            ) : (
                              <UserIcon className="w-5 h-5 text-primary-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{getRoleBadge(user.role)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4 text-muted-foreground" />
                          <span>{user.image_count || 0}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <CyberButton variant="ghost" size="sm" asChild>
                            <Link to={`/admin/users/${user.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </CyberButton>
                          <CyberButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(user.id)}
                          >
                            <Download className="w-4 h-4" />
                          </CyberButton>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <CyberButton variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </CyberButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass-panel border-border/50">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {user.name} and all their data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-muted hover:bg-muted/80">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-destructive hover:bg-destructive/80"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
};

export default ManageUsers;
