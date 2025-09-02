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
import { Textarea } from "@/components/ui/textarea";
import { Imentor } from "@/@types/interface/Imentor";
import { useUpdateMentorProfileMutation } from "@/services/apis/MentorApis";

export function EditMentorProfile({
  users,
  setIsOpen,
  setUsers,
}: {
  users: Imentor;
  setIsOpen: (isOpen: boolean) => void;
  setUsers: React.Dispatch<React.SetStateAction<Partial<Imentor>>>;
}) {
  const [updateProfile, { isLoading }] = useUpdateMentorProfileMutation();
  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: users.name,
      email: users.email,
      bio: users.bio || "",
      expertise: users.expertise ? users.expertise : "",
      yearsOfExperience: users.yearsOfExperience || 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof EditProfileSchema>) => {
    try {
      const id = users.id;
      const updatedData = {
        name: users.name !== data.name ? data.name : undefined,
        bio: users.bio !== data.bio ? (data.bio ? data.bio : "") : undefined,
        expertise:
          users.expertise !== data.expertise
            ? data.expertise
              ? data.expertise
              : ""
            : undefined,
        yearsOfExperience:
          users.yearsOfExperience !== data.yearsOfExperience
            ? data.yearsOfExperience
            : undefined,
      };
      const response: IaxiosResponse = await updateProfile({ id, updatedData });

      if (response.data) {
        setIsOpen(false);
        setUsers(response.data.data);
      } else {
        errorTost(
          "Something went wrong",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (error) {
      console.error("error:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  return (
    <Form {...form}>
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
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  About
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="w-full min-h-[100px] bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Expertise (comma-separated)
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
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Years of Experience
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sticky bottom-0 pt-4 pb-2 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300 dark:border-zinc-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isDirty}
            className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900"
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
