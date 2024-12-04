import { toast } from "@/hooks/use-toast";


export const AuthUnexpectedErrorTost =   toast({
    title: "An unexpected error occurred",
    description: "Please try again later.",
    className: "text-red-700 border bg-gray-200 mb-6",
});


export const errorTost = ( title:any , description:any )=> toast({
    title: title ,
    description: description,
    className: "text-red-700 border bg-gray-200 mb-6",
});

export const success = ( title: string , description: string ) => toast({
    title: title ,
    description: description,
    className: "text-green-500 border bg-gray-200 mb-6",
});