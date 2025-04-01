import React, { useEffect, useState } from "react";
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, User, Loader2, ArrowRight } from "lucide-react";
import { login, register } from "../store/slices/userSlice";
import toast from "react-hot-toast";
import { useAppDispatch } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("raj.shah1@gmail.com");
  const [password, setPassword] = useState("Raj@000");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, isLoading, error } = useSelector((state: RootState) => state.user);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    if (status) {
      console.log(status);
      navigate("/dashboard");
    }

    // dispatch(clearError());
  }, [navigate, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isLogin) {
        await dispatch(
          register({
            name: `${firstName} ${lastName}`,
            email,
            password,
          })
        ).unwrap();
        toast.success("Account created successfully");
      } else {
        await dispatch(
          login({
            email,
            password,
          })
        ).unwrap();
      }
    } catch (error) {
      console.log(error);
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header Tabs */}
        <div className="flex">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-4 text-center font-medium text-lg transition-all duration-300 ${
              isLogin ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            <LogIn className="inline mr-2 w-5 h-5" />
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-4 text-center font-medium text-lg transition-all duration-300 ${
              !isLogin ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            <UserPlus className="inline mr-2 w-5 h-5" />
            Register
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!isLogin && (
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-4 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                  required
                />
              </div>
            )}

            {!isLogin && (
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-4 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                  required
                />
              </div>
            )}

            {/* Email field */}
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-4 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                required
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-4 pl-12 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Additional options */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-gray-700">
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center px-6 py-4 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              {isLoading? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Login" : "Register"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle option */}
          <p className="text-center mt-8 text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleForm}
              className="ml-1 text-blue-500 hover:text-blue-700 font-medium transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
