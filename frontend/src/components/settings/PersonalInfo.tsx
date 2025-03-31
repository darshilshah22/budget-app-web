import React, { useState } from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { SettingTitle } from "../../pages/Settings";

interface PersonalInfoProps {
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
  };
  onUpdate?: (data: any) => void;
}

const PersonalInformationSection: React.FC<PersonalInfoProps> = ({
  initialData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
  },
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSave = () => {
    setIsEditing(false);
    onUpdate && onUpdate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 shadow-lg rounded-lg p-6 space-y-6"
    >
      <div className="flex items-center border-b pb-6">
        <SettingTitle
          title="Personal Information"
          description="Manage your personal information and preferences"
          IconEle={User}
        />
        {isEditing && <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="ml-auto inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Save Changes
        </motion.button>}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(!isEditing)}
          className={`${isEditing ? "ml-4" : "ml-auto"} inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl`}
        >
          {isEditing ? "Cancel" : "Edit"}
        </motion.button>
      </div>

      <div className="space-y-8 mx-3">
        {/* Name Field */}
        <div className="flex items-center">
          <User className="mr-6 text-gray-500" />
          {isEditing ? (
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-300"
              placeholder="Full Name"
            />
          ) : (
            <span className="text-white">{formData.firstName}</span>
          )}
        </div>

        {/* Email Field */}
        <div className="flex items-center">
          <Mail className="mr-6 text-gray-500" />
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-300"
              placeholder="Email Address"
            />
          ) : (
            <span className="text-white">{formData.email}</span>
          )}
        </div>

        {/* Phone Field */}
        <div className="flex items-center">
          <Phone className="mr-6 text-gray-500" />
          {isEditing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-300"
              placeholder="Phone Number"
            />
          ) : (
            <span className="text-white">
              {formData.phone || "Not provided"}
            </span>
          )}
        </div>

        {/* Location Field */}
        <div className="flex items-center">
          <MapPin className="mr-6 text-gray-500" />
          {isEditing ? (
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-300"
              placeholder="Location"
            />
          ) : (
            <span className="text-white">
              {formData.location || "Not specified"}
            </span>
          )}
        </div>
      </div>

      {/* {isEditing && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="w-full flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Save Changes
        </motion.button>
      )} */}
    </motion.div>
  );
};

export default PersonalInformationSection;
