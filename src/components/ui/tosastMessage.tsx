import { toast } from "@/hooks/use-toast";
import { CircleCheckBig } from "lucide-react";

export const AuthUnexpectedErrorTost = () =>
  toast({
    title: "An unexpected error occurred",
    description: "Please try again later.",
    className: "text-red-700 border bg-gray-200 mb-6",
  });

export const errorTost = (title: string, description: string) =>
  toast({
    title: title,
    description: description,
    className: "text-red-700 border bg-gray-200 mb-6",
  });

export const successToast = (title: string, description: string) => {
  toast({
    title: (
      <div className="flex ">
        <CircleCheckBig size={15} className="mr-2 mt-0.5" />
        {title}
      </div>
    ),
    description: description,
    className: "text-green-700 border bg-gray-200 mb-6",
  });
};
