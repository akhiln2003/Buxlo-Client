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
import { signInFormSchema } from "../zodeSchema/authSchema";
import { useSignInMutation } from "@/services/apis/UserApis";
import { IaxiosResponse } from "../@types/IaxiosResponse";


export function SigninForm() {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [isFormFilled, setIsFormFilled] = useState<boolean>(false);

  const [ signIn ] = useSignInMutation();

  // Zod Schema
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Watch for changes in both fields
  const email = form.watch("email");
  const password = form.watch("password");
  

  // Update button state when either field changes
  useEffect(() => {
    setIsFormFilled(email.length > 0 && password.length > 0);
  }, [email, password]);

  const onSubmit = async(data: z.infer<typeof signInFormSchema>) => {
    const { email, password } =  data
    const response: IaxiosResponse = await signIn({email , password});
    if( response.data ){

    }else{

    }
    
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-cabinet font-semibold text-xs text-zinc-500 dark:text-zinc-50">
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

        {/* Submit Button */}
        <Button
          type={isFormFilled ? "submit" : "button"}
          className={`font-cabinet w-5/6 rounded-none mx-[2rem] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${!isFormFilled
              ? "cursor-not-allowed bg-zinc-400 hover:bg-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-800"
              : "cursor-default bg-zinc-400 hover:bg-zinc-400 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-black"
            }`}
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
}
