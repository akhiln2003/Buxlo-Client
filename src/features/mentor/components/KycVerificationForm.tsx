import React, { useContext, useState } from "react";
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
import { Loader } from "lucide-react";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { KycVerificationSchema } from "../zodeSchema/KycVerificationSchema";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { useKycVerificationMutation } from "@/services/apis/MentorApis";
import { KycImageUploader } from "./KycImageUploader";
import { IMentor } from "@/@types/interface/IMentor";
import { SocketContext } from "@/contexts/socketContext";
import { useGetUser } from "@/hooks/useGetUser";
import { useCreateNotificationMutation } from "@/services/apis/CommonApis";

export function KycVerificationForm({
  id,
  setVerifyIsOpen,
  setUsers,
}: {
  id: string;
  setVerifyIsOpen: (isOpen: boolean) => void;
  setUsers: React.Dispatch<React.SetStateAction<Partial<IMentor>>>;
}) {
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
    null
  );
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [kycVerify, { isLoading }] = useKycVerificationMutation();
  const socketContext = useContext(SocketContext);
  const [createNotification] = useCreateNotificationMutation();
  const user = useGetUser();

  const form = useForm<z.infer<typeof KycVerificationSchema>>({
    resolver: zodResolver(KycVerificationSchema),
    defaultValues: {
      fullName: "",
      aadhaarNumber: "",
    },
  });

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    fieldName: "frontImage" | "backImage"
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        // Validate file using Zod schema
        KycVerificationSchema.shape[fieldName].parse(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          form.setValue(fieldName, file);
          // Clear any previous errors
          form.clearErrors(fieldName);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Set the error in react-hook-form
          form.setError(fieldName, {
            type: "manual",
            message: error.errors[0].message,
          });
          errorTost("Image Upload Error", [
            { message: error.errors[0].message },
          ]);
        }
      }
    }
  };

  const removeImage = (
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    fieldName: "frontImage" | "backImage"
  ) => {
    setPreview(null);
    form.setValue(fieldName, undefined);
    // Clear the error when removing the image
    form.clearErrors(fieldName);
  };

  const onSubmit = async (data: z.infer<typeof KycVerificationSchema>) => {
    try {
      const formData = new FormData();
      formData.append("data[aadhaarName]", data.fullName);
      formData.append("data[aadhaarNumber]", data.aadhaarNumber);
      formData.append("data[id]", id);
      if (data.frontImage) {
        formData.append("frontImage", data.frontImage);
      }
      if (data.backImage) {
        formData.append("backImage", data.backImage);
      }
      const response: IAxiosResponse = await kycVerify(formData);

      if (response.data.responseData) {
        setUsers((prev) => ({
          ...prev,
          verified: "verificationPending",
        }));
        setVerifyIsOpen(false);
        successToast(
          " Profile Verification Submitted",
          "Your profile verification request has been successfully submitted using Aadhaar. Our admin team will review your details and update the verification status soon. You will be notified once the process is complete."
        );

        await sendNotification(import.meta.env.VITE_ADMIN_ID as string);
      } else {
        errorTost(
          "KYC Submission Error",
          response.error.data.error || [
            { message: "Something went wrong, please try again later." },
          ]
        );
      }
    } catch (error) {
      console.error("KYC Submission Error:", error);
      errorTost("Submission Failed", [{ message: "Please try again" }]);
    }
  };

  const sendNotification = async (receiverId: string) => {
    try {
      const response = await createNotification({
        recipient: receiverId,
        type: "update",
        message: `${
          user?.name || "a user"
        } has submitted their KYC for verification.`,
        status: "unread",
      }).unwrap();
      if (response.notification) {
        socketContext?.notificationSocket?.emit("direct_notification", {
          receiverId,
          notification: response.notification,
        });
      } else {
        console.error("No notification data returned", response.error);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      errorTost("Something went wrong", [
        { message: "Please try again later" },
      ]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Full Name
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
            name="aadhaarNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Aadhaar Number
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
            name="frontImage"
            render={({ fieldState }) => (
              <KycImageUploader
                preview={frontImagePreview}
                onUpload={(e) =>
                  handleImageUpload(e, setFrontImagePreview, "frontImage")
                }
                onRemove={() => removeImage(setFrontImagePreview, "frontImage")}
                label="Front of Aadhaar"
                error={fieldState.error?.message}
              />
            )}
          />

          <FormField
            control={form.control}
            name="backImage"
            render={({ fieldState }) => (
              <KycImageUploader
                preview={backImagePreview}
                onUpload={(e) =>
                  handleImageUpload(e, setBackImagePreview, "backImage")
                }
                onRemove={() => removeImage(setBackImagePreview, "backImage")}
                label="Back of Aadhaar"
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="sticky bottom-0 pt-4 pb-2 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> updating
              </>
            ) : (
              "Submit KYC"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default KycVerificationForm;
