import React, { useState } from "react";
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
import { Loader, X, ImageIcon } from "lucide-react";
import { errorTost } from "@/components/ui/tosastMessage";
import { Imentor } from "@/@types/interface/Imentor";
import { useKycVerificationMutation } from "@/services/apis/UserApis";
import { KycVerificationSchema } from "../zodeSchema/KycVerificationSchema";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";



export function KycVerificationForm({
  users,
  setIsOpen,
  setUsers,
}: {
  users: Imentor;
  setIsOpen: (isOpen: boolean) => void;
  setUsers: React.Dispatch<React.SetStateAction<Partial<Imentor>>>;
}) {
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [kycVerify, { isLoading }] = useKycVerificationMutation();

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
        // Validate file before processing
        KycVerificationSchema.shape[fieldName].parse(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          form.setValue(fieldName, file);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        if (error instanceof z.ZodError) {
          errorTost("Image Upload Error", error.errors.map(e => ({ message: e.message })));
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
  };

  const onSubmit = async (data: z.infer<typeof KycVerificationSchema>) => {
    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('aadhaarNumber', data.aadhaarNumber);
      formData.append('frontImage', data.frontImage);
      formData.append('backImage', data.backImage);

      const response:IaxiosResponse = await kycVerify(formData);
      
      if (response.data) {
        setIsOpen(false);
        setUsers(response.data.data);
      } else {
        errorTost("KYC Submission Error", response.error.data.error);
      }
    } catch (error) {
      console.error("KYC Submission Error:", error);
      errorTost("Submission Failed", [{ message: "Please try again" }]);
    }
  };

  const ImageUploader = ({
    preview,
    onUpload,
    onRemove,
    label,
  }: {
    preview: string | null;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    label: string;
  }) => (
    <div className="space-y-2">
      <FormLabel className="text-gray-700 dark:text-gray-300">
        {label}
      </FormLabel>
      <div className="relative w-full h-48 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
            <ImageIcon className="h-12 w-12 mb-2" />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              id={`${label.toLowerCase().replace(" ", "-")}-upload`}
              onChange={onUpload}
            />
            <label
              htmlFor={`${label.toLowerCase().replace(" ", "-")}-upload`}
              className="cursor-pointer text-blue-500 hover:underline"
            >
              Upload {label}
            </label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Full Name Field */}
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

          {/* Aadhaar Number Field */}
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

          {/* Front Image Uploader */}
          <ImageUploader
            preview={frontImagePreview}
            onUpload={(e) =>
              handleImageUpload(e, setFrontImagePreview, "frontImage")
            }
            onRemove={() => removeImage(setFrontImagePreview, "frontImage")}
            label="Front of Aadhaar"
          />

          {/* Back Image Uploader */}
          <ImageUploader
            preview={backImagePreview}
            onUpload={(e) =>
              handleImageUpload(e, setBackImagePreview, "backImage")
            }
            onRemove={() => removeImage(setBackImagePreview, "backImage")}
            label="Back of Aadhaar"
          />
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 pt-4 pb-2 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900"
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Submit KYC
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default KycVerificationForm;
