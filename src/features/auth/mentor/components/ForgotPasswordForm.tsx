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
import { IaxiosResponse } from "../@types/IaxiosResponse";
import { Loader } from "lucide-react";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { ForgotPasswordFormSchema } from "../../zodeSchema/authSchema";
import { useForgotPasswordMentorMutation } from "@/services/apis/AuthApis";


export function ForgotPasswordForm() {
  const [isFormFilled, setIsFormFilled] = useState<boolean>(false);
  const [ buttonStage ,setButtStage ] = useState<boolean>(true);
  const [forgotPassword, { isLoading }] = useForgotPasswordMentorMutation();


  // Zod Schema
  const form = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Watch for changes in both fields
  const email = form.watch("email");

  // Update button state when either field changes
  useEffect(() => {
    setIsFormFilled(email.length > 0 );
  }, [email ]);
useEffect(()=> {},[setButtStage])
  const onSubmit = async (data: z.infer<typeof ForgotPasswordFormSchema>) => {
    const { email } = data;
    
    const response: IaxiosResponse = await forgotPassword( {email} );
    
    if( response.data ){
        setButtStage(!buttonStage);
        successToast("succesfull" , response.data.message);
        return
    }
    
    if (response.error?.data?.error) {
        errorTost("Something when wrong", response.error.data.error[0].message );
        return
    } else {      
      errorTost("Something when wrong", `please try laiter` );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full flex flex-col justify-center items-center ">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full px-[5rem]  ">
              <FormLabel className="  font-cabinet font-semibold text-xs text-zinc-500 dark:text-zinc-50">
                EMAIL ADDRESS
              </FormLabel>
              <FormControl >
                <Input className="  border border-zinc-900  " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type={isFormFilled && !isLoading && buttonStage ? "submit" : "button"}
          className={`font-cabinet w-3/6 rounded-none  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            !isFormFilled && !isLoading || !buttonStage
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
