import { useState, useEffect } from "react";
import { AuthModal } from "../components/AuthModal";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Take Control of Your
            <span className="text-blue-500"> Finances</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in">
            Track your expenses, set budgets, and achieve your financial goals
            with our intuitive budgeting app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 hover-button cursor-pointer"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-800 rounded-xl hover-card animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Track Expenses</h3>
            <p className="text-gray-400">
              Monitor your spending habits and identify areas where you can save
              money.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl hover-card animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Set Budgets</h3>
            <p className="text-gray-400">
              Create and manage budgets for different categories to stay on
              track.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl hover-card animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Achieve Goals</h3>
            <p className="text-gray-400">
              Set financial goals and track your progress towards achieving
              them.
            </p>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
