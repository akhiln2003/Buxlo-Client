import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { Eye, EyeOff, Loader } from "lucide-react";
import { ChangePasswordSchema } from "../zodeSchema/ChangePasswordSchema";
import { useChanegePasswordMutation } from "@/services/apis/CommonApis";
import { useGetUser } from "@/hooks/useGetUser";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";

type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;

export function ChangePasswordForm({
  setShowChangePassword,
}: {
  setShowChangePassword: (isPhotoDialogOpen: boolean) => void;
}) {
  const [updatePassword, { isLoading }] = useChanegePasswordMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const user = useGetUser();

  const form = useForm<ChangePasswordType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordType) => {
    try {
      const response: IaxiosResponse = await updatePassword({
        userId: user?.id as string,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (response.data) {
        successToast(
          "Updated",
          response.data.result.message || "password updated successfully"
        );
        setShowChangePassword(false);
      } else {
        errorTost(
          "Something went wrong ",
          response.error.data.error || [
            { message: "Something went wrong please try again" },
          ]
        );
      }
    } catch (error) {
      console.error("Error updating password", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 max-w-md px-4 py-6"
      >
        {/* Current Password with Eye Icon */}
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    {...field}
                    className="w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-400"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* New Password with Eye Icon */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    {...field}
                    className="w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-400"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm New Password (no eye icon as requested) */}
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  className="w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900"
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </div>
      </form>
    </Form>
  );
}
