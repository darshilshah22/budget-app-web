import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { SettingTitle } from "../../pages/Settings";
import { IndianRupee } from "lucide-react";

interface CurrencySettingsProps {
  initialCurrency?: string;
  onUpdateCurrency?: (currency: string) => void;
}

const CurrencySettingsSection: React.FC<CurrencySettingsProps> = ({
  initialCurrency = "USD",
  onUpdateCurrency,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);

  const currencies = [
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  ];

  const handleCurrencySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    onUpdateCurrency && onUpdateCurrency(currencyCode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 shadow-lg rounded-lg p-6 space-y-6"
    >
      <div className="flex items-center border-b pb-4">
        <SettingTitle
          title="Currency Settings"
          description="Manage your currency settings"
          IconEle={CreditCard}
        />
      </div>

      <div className="space-y-4 mx-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IndianRupee className="mr-3 text-gray-300" />
            <span className="text-gray-200">Default Currency</span>
          </div>
          <span className="text-blue-600 font-semibold">
            {selectedCurrency}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {currencies.map((currency) => (
            <motion.div
              key={currency.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCurrencySelect(currency.code)}
              className={`
                flex items-center justify-between p-3 rounded-lg cursor-pointer
                ${
                  selectedCurrency === currency.code
                    ? "bg-blue-200 border-3"
                    : "bg-gray-700/50 hover:bg-gray-700"
                }
                transition-all duration-300
              `}
            >
              <div className="flex flex-col items-start gap-2">
                <span className={`font-semibold ${selectedCurrency === currency.code ? "text-gray-800" : "text-gray-200"}`}>{currency.name}</span>
                <div className={`text-sm ${selectedCurrency === currency.code ? "text-gray-800" : "text-gray-400"}`}>{currency.code}</div>
              </div>
              <div className={`text-xl font-bold ${selectedCurrency === currency.code ? "text-gray-800" : "text-gray-200"}`}>{currency.symbol}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CurrencySettingsSection;
