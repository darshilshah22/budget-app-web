import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
}

interface AnimatedDropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  onSelect?: (value: string) => void;
}

const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({
  options,
  placeholder = "Select an option",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect?.(option.value);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Header */}
      <button
        onClick={toggleDropdown}
        className={`
          w-full 
          flex 
          items-center 
          justify-between 
          px-4
          py-1.5
          rounded-lg 
          transition-all 
          duration-300 
          bg-gray-700/50
        `}
      >
        <span
          className={`text-sm font-medium
          ${selectedOption ? "text-white" : "text-gray-500"}
        `}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`
            transform 
            transition-transform 
            duration-300 
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          className="
            absolute 
            z-10 
            w-full 
            mt-2 
            bg-gray-800 
            border 
            border-gray-200 
            rounded-lg 
            shadow-lg 
            max-h-60 
            overflow-y-auto 
            animate-dropdown-enter
          "
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionSelect(option)}
              className={`
                px-4 
                py-2 
                cursor-pointer 
                flex 
                items-center 
                justify-between 
                hover:bg-gray-700 
                transition-colors 
                duration-200
                ${
                  selectedOption?.value === option.value
                    ? "bg-gray-700"
                    : "text-white"
                }
              `}
            >
              {option.label}
              {selectedOption?.value === option.value && (
                <Check className="text-blue-600 w-5 h-5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedDropdown;
