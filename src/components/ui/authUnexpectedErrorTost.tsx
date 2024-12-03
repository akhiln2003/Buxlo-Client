import { toast } from "@/hooks/use-toast";


export const AuthUnexpectedErrorTost =   toast({
    title: "An unexpected error occurred",
    description: "Please try again later.",
    className: "text-red-700 border bg-gray-200 mb-6",
});