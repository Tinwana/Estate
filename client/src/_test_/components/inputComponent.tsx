import { cva, VariantProps } from "class-variance-authority";
const inputStyles = cva(["bg-slate-100 p-2 rounded-lg"], {
  variants: {
    variant: {
      default: [],
      radio: [],
      checkbox: [],
      select: [],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputProps extends VariantProps<typeof inputStyles> {
  type?: string;
  placeholder?: string;
}

const InputComponent = ({
  type = "text",
  placeholder,
  variant,
}: InputProps) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        className={inputStyles({ variant })}
      />
    </>
  );
};

export default InputComponent;
