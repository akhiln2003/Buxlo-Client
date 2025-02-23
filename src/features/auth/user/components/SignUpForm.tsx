import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSignUpUserMutation } from "@/services/apis/AuthApis";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { errorTost } from "@/components/ui/tosastMessage";
import { signUpFormSchema } from "../../zodeSchema/authSchema";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { Loader } from "lucide-react";

// Zod Schema

export function SignUnForm() {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [isFormFilled, setIsFormFilled] = useState<boolean>(false);

  const [signUp, { isLoading }] = useSignUpUserMutation();

  const navigate = useNavigate();

  // zode schema for validation
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch for changes in both fields
  const name = form.watch("name");
  const email = form.watch("email");
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  // Update button state when either field changes
  useEffect(() => {
    setIsFormFilled(
      name.length > 0 &&
        email.length > 0 &&
        password.length > 0 &&
        confirmPassword.length > 0
    );
  }, [name, email, password, confirmPassword]);

  const onSubmit = async (data: z.infer<typeof signUpFormSchema>) => {
    try {
      const { name, email, password } = data;
      const newUser = {
        name,
        email,
        password,
      };

      const response: IaxiosResponse = await signUp(newUser);

      if (response.data) {
        navigate(UserUrls.otp, { state: { name, email } });
      } else {
        errorTost(
          "Somthing when wrong ",
          response.error.data.error || [
            { message: `${response.error.data} please try again laiter` },
          ]
        );
      }
    } catch (error) {
      console.error("error :", error);
      errorTost("Somthing wrong", [
        { message: "Somting when wrong please try again" },
      ]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-cabinet font-semibold text-xs text-zinc-500 dark:text-zinc-50">
                UserName
              </FormLabel>
              <FormControl>
                <Input placeholder="UserName" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-cabinet font-semibold text-xs text-zinc-500 dark:text-zinc-50 ">
                EMAIL ADDRESS
              </FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
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
        <div className="w-full flex flex-col items-center justify-center  mt-[1rem]">
          <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium">
            By creating an account, you agree to our{" "}
            <span className=" underline ">Terms of Service</span>
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium ">
            and have read and understood the{" "}
            <span className=" underline">Privacy Policy</span>
          </p>
        </div>

        {/* Submit Button */}
        <Button
          //  onClick={}
          type={isFormFilled && !isLoading ? "submit" : "button"}
          className={`font-cabinet w-5/6 rounded-none mx-[2rem] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            !isFormFilled
              ? "cursor-not-allowed bg-zinc-400 hover:bg-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800"
              : "cursor-default bg-zinc-900 hover:bg-zinc-950 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-black"
          }`}
        >
          {isLoading ? "Loading " : "Sign Up"}
          {isLoading && <Loader className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
