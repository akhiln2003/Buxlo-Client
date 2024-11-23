import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    setPasswordVisibility?: React.Dispatch<React.SetStateAction<boolean>>;
    passwordVisibility?: boolean;
  }
>(
  (
    { className, type, setPasswordVisibility, passwordVisibility, ...props },
    ref
  ) => {
    const handlePasswordVisibility = () => {
      if (setPasswordVisibility) {
        setPasswordVisibility((prev) => !prev );
      }
    };

    return (
      <div className="relative flex items-center">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full border-b border-zinc-300 dark:border-zinc-600 bg-transparent py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:font-medium placeholder:font-cabinet focus-visible:outline-none dark:focus-visible:border-b-zinc-300 focus-visible:border-b-black focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {setPasswordVisibility !== undefined && (
          <button
            type="button"
            onClick={handlePasswordVisibility}
            className="absolute right-2 flex items-center justify-center h-full text-muted-foreground focus:outline-none"
          >
            {passwordVisibility ? <Eye size={20} /> : <EyeClosed size={20} />}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
