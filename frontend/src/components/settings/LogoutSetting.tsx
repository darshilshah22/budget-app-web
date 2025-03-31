import React, { useState } from "react";
import { LogOut, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { SettingTitle } from "../../pages/Settings";

interface LogoutProps {
  onLogout: () => void;
  userName?: string;
}

const LogoutSection: React.FC<LogoutProps> = ({
  onLogout,
  userName = "John Doe",
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogoutConfirmation = () => {
    onLogout();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 shadow-lg rounded-lg p-6 space-y-6"
    >
      <div className="flex items-center border-b pb-4">
        <SettingTitle
          title="Logout"
          description="Logout from your account"
          IconEle={LogOut}
        />
      </div>

      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-gray-100 rounded-full p-4">
          <LogOut className="text-red-500" size={48} />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-200">
            Logging out, {userName}?
          </h3>
          <p className="text-gray-400 mt-2">
            You will be signed out of your account on this device.
          </p>
        </div>

        {!showConfirmation ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConfirmation(true)}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center"
          >
            <LogOut className="mr-2" />
            Logout
          </motion.button>
        ) : (
          <div className="w-full space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 flex items-center">
              <AlertTriangle className="mr-3 text-yellow-500" />
              <p className="text-yellow-700">
                Are you sure you want to logout?
              </p>
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogoutConfirmation}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                <LogOut className="mr-2 inline" />
                Confirm Logout
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LogoutSection;
