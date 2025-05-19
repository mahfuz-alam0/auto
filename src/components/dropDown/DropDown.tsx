import React, { useEffect, useRef, useState, ReactNode } from "react";
import { CaretDownOutlined } from "@ant-design/icons";

interface DropdownProps {
  selectedValue: any;
  setSelectedValue: React.Dispatch<React.SetStateAction<any>>;
  placeholder: string;
  children: ReactNode;
  disabled?: boolean;
}

interface OptionProps {
  children: ReactNode;
  option: any;
}

const Dropdown = ({
  selectedValue,
  setSelectedValue,
  placeholder,
  children,
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: any): void => {
    setSelectedValue(option);
    setIsOpen(false);
  };

  return (
    <div className={`custom-dropdown ${isOpen ? "open" : ""}`} ref={dropdownRef}>
      <div
        className={`dropdown-header ${disabled ? "disabled" : ""}`}
        onClick={toggleDropdown}
      >
        {selectedValue || placeholder} <CaretDownOutlined className="dropdown-icon" />
      </div>
      {isOpen && (
        <ul className="dropdown-list">
          {React.Children.map(children, (child) => {
            if (React.isValidElement<OptionProps>(child)) {
              return React.cloneElement(child, { handleSelect });
            }
            return child;
          })}
        </ul>
      )}
    </div>
  );
};

const Option = ({ children, option, handleSelect }: OptionProps) => {
  return (
    <li
      className="dropdown-item"
      onClick={() => handleSelect(option)}
    >
      {children}
    </li>
  );
};

Dropdown.Option = Option;

export default Dropdown;
