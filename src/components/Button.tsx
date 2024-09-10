import { Loader2Icon } from "lucide-react";
import { twMerge } from "tailwind-merge";

type TButtonProps = {
  label?: string;
  type?: "submit" | "button" | "reset" | undefined;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
};

const Button: React.FC<TButtonProps> = ({
  label = "Button",
  type = "button",
  className = "",
  loading = false,
  disabled = false,
  icon,
  onClick,
  ...props
}) => {
  return (
    <>
      {loading ? (
        <Loader2Icon color="black" className="animate-spin" size={30} />
      ) : (
        <button
          type={type}
          disabled={disabled}
          className={twMerge(
            `w-full h-[48px] px-4 gap-2 flex items-center justify-center bg-primary ${
              disabled ? "opacity-30 " : ""
            } text-white font-semibold rounded-lg whitespace-nowrap ${
              !disabled && "hover:opacity-80 transition-opacity duration-100"
            }`,
            className
          )}
          onClick={onClick}
          {...props}
        >
          {icon ? icon : null}
          {label}
        </button>
      )}
    </>
  );
};

export default Button;
