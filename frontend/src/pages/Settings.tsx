import { useNavigate } from "react-router-dom";
import PersonalInfo from "../components/settings/PersonalInfo";
import CurrencySettings from "../components/settings/CurrencySettings";
import ChangePassword from "../components/settings/ChangePassword";
import LogoutSetting from "../components/settings/LogoutSetting";
import { logout } from "../store/slices/userSlice";
import { useAppDispatch } from "../store/hooks";
import { useUser } from "../hooks/useUser";

export const SettingTitle = ({
  title,
  description,
  IconEle,
}: {
  title: string;
  description: string;
  IconEle: React.ElementType;
}) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="p-3 rounded-full bg-gray-700 shadow-lg">
        <IconEle className="h-6 w-6 text-blue-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useUser();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate("/");
    });
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      {/* Personal Info Section */}
      <PersonalInfo initialData={user as any} />

      <CurrencySettings initialCurrency={user?.currency} />

      <ChangePassword />

      <LogoutSetting onLogout={handleLogout} userName={user?.firstName} />
    </div>
  );
}
