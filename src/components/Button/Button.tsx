import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={
        "w-[100%] h-[60px] rounded-[10px] bg-blue-primary text-white text-[16px] font-[700] disabled:bg-button-disabled flex justify-center items-center"
      }
    >
      {children}
    </button>
  );
};
