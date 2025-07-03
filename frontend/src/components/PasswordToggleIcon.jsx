import { EyeIcon, EyeOffIcon } from "lucide-react";

const PasswordToggleIcon = ({ show, onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 disabled:opacity-50"
    >
      {show ? (
        <EyeIcon className="w-4 h-4" />
      ) : (
        <EyeOffIcon className="w-4 h-4" />
      )}
    </button>
  );
};

export default PasswordToggleIcon;
