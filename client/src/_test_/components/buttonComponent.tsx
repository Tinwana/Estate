import { cva, VariantProps } from "class-variance-authority";
const buttonStyles = cva(["p-3 rounded-lg cursor-pointer"], {
  variants: {
    variant: {
      dark: [
        "bg-slate-700 uppercase hover:bg-slate-500 disabled:opacity-80 w-full text-white",
      ],
      scarlet: ["bg-red-700 uppercase hover:bg-red-500 w-full text-white"],
      share: [
        "z-10 bg-slate-100 border rounded-full w-20 h-20 flex justify-center items-center",
      ],
    },
  },
  defaultVariants: {
    variant: "dark",
  },
});

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  type?: any;
  children: React.ReactNode;
}

const ButtonComponent = ({
  type,
  children,
  variant,
  ...props
}: ButtonProps) => {
  return (
    <>
      <button {...props} type={type} className={buttonStyles({ variant })}>
        {children}
      </button>
    </>
  );
};

export default ButtonComponent;
