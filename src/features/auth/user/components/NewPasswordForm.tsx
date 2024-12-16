import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { NewPasswordFormSchema } from "../../zodeSchema/authSchema";
import { IaxiosResponse } from "../@types/IaxiosResponse";
import { Loader } from "lucide-react";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { useSetNewPasswordUserMutation } from "@/services/apis/AuthApis";
import { useNavigate, useParams } from "react-router-dom";
import { UserUrls } from "@/@types/urlEnums/UserUrls";

export function NewPasswordForm() {
  const [isFormFilled, setIsFormFilled] = useState<boolean>(false);
  const [buttonStage, setButtStage] = useState<boolean>(true);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);

  const [setNewPassword, { isLoading }] = useSetNewPasswordUserMutation();
  const { token } = useParams();
  const navigate = useNavigate();
  // Zod Schema
  const form = useForm<z.infer<typeof NewPasswordFormSchema>>({
    resolver: zodResolver(NewPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Watch for changes in both fields
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  // Update button state when either field changes
  useEffect(() => {
    setIsFormFilled(password.length > 0 && confirmPassword.length > 0);
  }, [confirmPassword, password]);
  useEffect(() => {}, [setButtStage]);

  const onSubmit = async (data: z.infer<typeof NewPasswordFormSchema>) => {
    const { password } = data;

    const response: IaxiosResponse = await setNewPassword({ password, token });
    if (response.data) {
      setButtStage(!buttonStage);
      successToast("succesfull", response.data.message);
      navigate(UserUrls.signIn);
      return;
    } else {
      errorTost("Something when wrong", response.error.data.error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full flex flex-col items-center"
      >
        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-4/6">
              <FormLabel className="font-cabinet font-semibold text-xs text-zinc-500 dark:text-zinc-50">
                PASSWORD
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Password"
                  type={passwordVisibility ? "text" : "password"}
                  {...field}
                  passwordVisibility={passwordVisibility}
                  setPasswordVisibility={setPasswordVisibility}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ConfirmPassword Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="w-4/6">
              <FormLabel className="font-cabinet font-semibold text-xs text-zinc-500 dark:text-zinc-50">
                CONFIRM PASSWORD
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ConfirmPassword"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type={isFormFilled && !isLoading ? "submit" : "button"}
          className={`font-cabinet w-4/6 rounded-none  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            !isFormFilled && !isLoading
              ? "cursor-not-allowed bg-zinc-400 hover:bg-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-800"
              : "cursor-default bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-black"
          }`}
        >
          {isLoading ? "Loading " : "Sign In"}
          {isLoading && <Loader className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
