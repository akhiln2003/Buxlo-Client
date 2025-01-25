import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Shadcn UI components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { ContactPageFormSchema } from "../../zodeSchema/ContactPageFormSchema";
import { useContactUsMutation } from "@/services/apis/CommonApis";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { Loader } from "lucide-react";

function ContactPageForm() {
  const [contactUs, { isLoading }] = useContactUsMutation();

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof ContactPageFormSchema>>({
    resolver: zodResolver(ContactPageFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ContactPageFormSchema>) => {
    try {

      const response: IaxiosResponse = await contactUs(data);

      if (response.data.message) {
      successToast("succesfull", response.data.message);        
      } else {
        errorTost(
          "Somthing when wrong ",
          response.error.data.error || [
            { message: `${response.error.data} please try again laiter` },
          ]
        );
      }
    } catch (error) {
      console.error(error);
      errorTost("Somthing wrong", [
        { message: "Somting when wrong please try again" },
      ]);
    }
  };

  return (
    // Pass the `form` object to the Shadcn UI Form component
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full p-5"
      >
        <div className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Name</FormLabel> */}
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your Name"
                    className="w-full h-12 border p-2"
                  />
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
                {/* <FormLabel>Email</FormLabel> */}
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email Address"
                    type="email"
                    className="w-full h-12 border p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subject Field */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Subject</FormLabel> */}
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Subject"
                    className="w-full  border p-2 h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message Field */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Message</FormLabel> */}
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Message"
                    className="w-full min-h-[100px]  border p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          {
            isLoading ? 
            <Button
            type="submit"
            className=" w-2/6 bg-zinc-900 text-white dark:hover:bg-zinc-800"
          >
            < Loader className=" animate-spin" />
          </Button>
          :
          <Button
            type="submit"
            className=" w-2/6 bg-zinc-900 text-white dark:hover:bg-zinc-800"
          >
            Submit
          </Button>
          }
        </div>
      </form>
    </Form>
  );
}

export default ContactPageForm;
