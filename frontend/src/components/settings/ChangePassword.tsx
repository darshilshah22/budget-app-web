import React, { useState } from "react";
import { Lock, Eye, EyeOff, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SettingTitle } from "../../pages/Settings";
// import { updateUserPassword } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../store/hooks";
import toast from "react-hot-toast";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthLabel = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColor = [
    "text-red-500",
    "text-orange-500",
    "text-yellow-500",
    "text-green-500",
    "text-green-700",
  ];

  const strengthLevel = calculateStrength();

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 bg-gray-200 h-2 rounded-full">
        <div
          className={`h-full rounded-full ${strengthColor[strengthLevel]}`}
          style={{ width: `${(strengthLevel + 1) * 20}%` }}
        />
      </div>
      <span className={`text-sm font-semibold ${strengthColor[strengthLevel]}`}>
        {strengthLabel[strengthLevel]}
      </span>
    </div>
  );
};

const ChangePasswordSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePasswords = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordFields.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (passwordFields.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };

  const handleSubmit = () => {
    if (validatePasswords()) {
      // dispatch(updateUserPassword({ newPassword: passwordFields.newPassword, currentPassword: passwordFields.currentPassword }));
      toast.success("Password changed successfully");
      console.log("Password change submitted");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 shadow-lg rounded-lg p-6 space-y-6"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <SettingTitle
          title="Change Password"
          description="Change your password"
          IconEle={Lock}
        />
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Change Password
        </motion.button>
      </div>

      <div className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={passwordFields.currentPassword}
              onChange={(e) =>
                setPasswordFields((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className={`
                w-full px-3 py-2 border rounded-md outline-none
                ${
                  passwordErrors.currentPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }
              `}
            />
            <button
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordErrors.currentPassword && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <XCircle className="mr-2" size={16} />
              {passwordErrors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={passwordFields.newPassword}
              onChange={(e) =>
                setPasswordFields((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              className={`
                w-full px-3 py-2 border rounded-md outline-none
                ${
                  passwordErrors.newPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }
              `}
            />
            <button
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="mt-2">
            <PasswordStrength password={passwordFields.newPassword} />
          </div>
          {passwordErrors.newPassword && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <XCircle className="mr-2" size={16} />
              {passwordErrors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordFields.confirmPassword}
              onChange={(e) =>
                setPasswordFields((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className={`
                w-full px-3 py-2 border rounded-md outline-none
                ${
                  passwordErrors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }
              `}
            />
            <button
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <XCircle className="mr-2" size={16} />
              {passwordErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChangePasswordSection;
