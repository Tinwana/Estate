import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
const buttonStyles = cva(["p-3 rounded-lg cursor-pointer"], {
  variants: {
    variant: {
      dark: [
        "bg-slate-700 uppercase hover:bg-slate-500 disabled:opacity-50 disabled:select-none disabled:cursor-not-allowed w-full text-white",
      ],
      scarlet: [
        "bg-red-700 uppercase hover:bg-red-500 w-full text-white disabled:opacity-50 disabled:select-none disabled:cursor-not-allowed",
      ],
      crimson: [
        "bg-[#de917b] hover:bg-[#e0a898] text-[#491c0f] w-full disabled:opacity-50 disabled:select-none disabled:cursor-not-allowed ",
      ],
      share: [
        "z-10 bg-slate-100 border rounded-full w-20 h-20 flex justify-center items-center disabled:opacity-50 disabled:select-none disabled:cursor-not-allowed",
      ],
      primary: [
        "bg-blue-700 hover:bg-blue-500 uppercase text-white w-full disabled:opacity-50 disabled:select-none disabled:cursor-not-allowed",
      ],
    },
    outline: {
      default: [],
      scarlet: [
        "bg-transparent hover:bg-[#fbede9] border-[1px] border-[#b2978f] text-[#b2978f]",
      ],
    },
  },
  defaultVariants: {
    variant: "dark",
    outline: "default",
  },
});

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  type?: any;
  disabled?: boolean;
  classNames?: string;
  onClick?: (e?: any) => void;
  children: React.ReactNode;
}

const ButtonComponent = ({
  type = "button",
  onClick,
  disabled,
  classNames,
  children,
  variant,
  outline,
  ...props
}: ButtonProps): JSX.Element => {
  return (
    <>
      <button
        {...props}
        onClick={onClick}
        type={type}
        className={twMerge(buttonStyles({ variant, outline }), classNames)}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  );
};

export default ButtonComponent;
