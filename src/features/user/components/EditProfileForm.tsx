// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { z } from "zod";
// import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
// import { errorTost } from "@/components/ui/tosastMessage";
// import { Loader } from "lucide-react";
// import { Textarea } from "@/components/ui/textarea";
// import { Iuser } from "@/@types/interface/Iuser";
// import { EditProfileSchema } from "../zodeSchema/EditProfileSchema";
// import { useUpdateUserProfileMutation } from "@/services/apis/UserApis";
// import { Form } from "@/components/ui/form";

// export function EditUserProfile({ users, setIsOpen , setUsers }:{users:Iuser , setIsOpen:(isOpen: boolean) => void ,  setUsers: React.Dispatch<React.SetStateAction<Partial<Iuser>>>; }) {
//   const [updateProfile, ] = useUpdateUserProfileMutation();
//   const form = useForm<z.infer<typeof EditProfileSchema>>({
//     resolver: zodResolver(EditProfileSchema),
//     defaultValues: {
//       name: users.name,
//       email: users.email ,
//       phone: "11234456789"
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof EditProfileSchema>) => {
//     try {
//       const id = users.id;
//       const updatedData = {
//         name: users.name !== data.name ? data.name : undefined,
//       }
//       const response: IaxiosResponse = await updateProfile({ id , updatedData});

//       if (response.data) {
//         setIsOpen(false);
//         setUsers(response.data.data)
//       } else {
//         errorTost(
//           "Something went wrong",
//           response.error.data.error || [
//             { message: `${response.error.data} please try again later` },
//           ]
//         );
//       }
//     } catch (error) {
//       console.log("error:", error);
//       errorTost("Something wrong", [
//         { message: "Something went wrong please try again" },
//       ]);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <div className="space-y-4">
//         <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Name
//               </label>
//               <Input
//                 name="name"
//                 value={users.name}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Email
//               </label>
//               <Input
//                 name="email"
//                 type="email"
//                 value={users.email}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Phone
//               </label>
//               <Input
//                 name="phone"
//                 type="tel"
//                 value={90778655}
//                 onChange={handleInputChange}
//                 className="w-full"
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit">
//                 Save Changes
//               </Button>
//             </div>
//         </div>
//       </form>
//     </Form>
//   );
// }

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EditProfileSchema } from "../zodeSchema/EditProfileSchema";
import { errorTost } from "@/components/ui/tosastMessage";
import { Loader } from "lucide-react";
import { Iuser } from "@/@types/interface/Iuser";
import { useUpdateUserProfileMutation } from "@/services/apis/UserApis";

export function EditUserProfile({
  users,
  setIsOpen,
  setUsers,
}: {
  users: Partial<Iuser>;
  setIsOpen: (isOpen: boolean) => void;
  setUsers: React.Dispatch<React.SetStateAction<Partial<Iuser>>>;
}) {
  console.log(users);
  
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: users.name,
      email: users.email,
      phone: "11234456789",
    },
  });

  const onSubmit = async (data: z.infer<typeof EditProfileSchema>) => {
    try {      
      const id =  users.id;
      const updatedData = {
        name: users.name !== data.name ? data.name : undefined,
      }
      
      const response: IaxiosResponse = await updateProfile({ id, updatedData });      
      if (response.data.data) {
        setIsOpen(false);
        setUsers(response.data.data)
      } else {
        errorTost(
          "Something went wrong",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (error) {
      console.log("error:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col h-full max-h-[80vh]">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        readOnly
                        className="w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-4 px-4 py-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300 dark:border-zinc-700"
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900"
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </Form>
  );
}
