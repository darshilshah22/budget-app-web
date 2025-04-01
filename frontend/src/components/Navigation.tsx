import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  Menu,
  X,
  User,
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Calendar,
  Settings,
  BarChart,
} from "lucide-react";
import { logout } from "../store/slices/userSlice";
import { useAppDispatch } from "../store/hooks";
import { fetchAllTransactions } from "../store/slices/transactionSlice";
import profile from "../assets/profile.png";
import { useUser } from "../hooks/useUser";
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Budgets", href: "/budgets", icon: PiggyBank },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Insights", href: "/insights", icon: BarChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Navigation() {
  const location = useLocation();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await dispatch(logout());
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchAllTransactions());
    }
  }, [dispatch, user]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/dashboard")}>
            <h1 className="text-xl font-bold text-white">Budget App</h1>
          </div>
          <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-blue-500 text-white"
                      : "border-transparent text-gray-400 hover:border-gray-600 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8 cursor-pointer" onClick={() => navigate("/settings")}>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <img src={profile} alt="Profile" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-lg font-medium">{user?.firstName}</span>
            </div>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`sm:hidden ${
          isMobileMenuOpen ? "block animate-slide-in" : "hidden"
        }`}
      >
        <div className="pt-2 pb-3 space-y-1 bg-gray-900">
          <div className="px-3 py-2 flex items-center text-gray-300 border-b border-gray-800">
            <User className="h-5 w-5 mr-3" />
            <span className="text-base font-medium">{user?.firstName}</span>
          </div>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
          <div className="px-3 py-2">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
