"use client";
import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
const inputStyles = cva(["bg-slate-200 p-3 rounded-lg w-auto"], {
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
  required?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
  value?: any;
  defaultValue?: any;
  classNames?: string;
  checked?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputComponent = ({
  type = "text",
  required = true,
  placeholder,
  variant,
  id,
  name,
  value,
  checked,
  defaultValue,
  classNames,
  onChange,
}: InputProps) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        className={twMerge(inputStyles({ variant }), classNames)}
        required={required}
        id={id}
        onChange={onChange}
        name={name}
        value={value}
        defaultValue={defaultValue}
        checked={checked}
      />
    </>
  );
};

export default InputComponent;
