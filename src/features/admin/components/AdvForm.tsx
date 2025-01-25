import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader, X } from "lucide-react";
import { useState, useRef } from "react";
import { Iadv } from "@/@types/interface/Iadv";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import {
  useCreateAdvMutation,
  useFetchAdvImageMutation,
} from "@/services/apis/AdminApis";
import { AdvFormSchema } from "../zodeSchema/AdvFormSchema";


// TypeScript type inference from Zod schema
type FormInputs = z.infer<typeof AdvFormSchema>;

export const AdvForm = ({
  setIsOpen,
  setAdvData,
  setAdvImage
}: {
  setIsOpen: (setIsOpen: boolean) => void;
  setAdvData: React.Dispatch<React.SetStateAction<Iadv[]>>;
  setAdvImage: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(AdvFormSchema),
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadData, { isLoading }] = useCreateAdvMutation();
  const [fetchAdvImages] = useFetchAdvImageMutation();

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewUrl(null);
    setValue("image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormInputs) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    try {
      const formData = new FormData();
      formData.append("data[title]", data.title);
      formData.append("data[description]", data.description);
      formData.append("image", data.image[0]);

      const response: IaxiosResponse = await uploadData(formData);
      if (response.data.responseData) {
        const value: Iadv = response.data.responseData;

        if (value.image) {
          const keys: string[] = [`Adv/${value.image}`];
          const trustedUsImageUrls: IaxiosResponse = await fetchAdvImages({
            keys: keys,
          });
          if (trustedUsImageUrls.data.imageUrl) {
            setAdvImage((prev) => [
              ...prev,
              ...trustedUsImageUrls.data.imageUrl,
            ]);
            setAdvData((prev) => [...prev, value]);
          } else {
            errorTost(
              "Error fetching Trusted Us Images",
              trustedUsImageUrls.error.data.error
            );
          }
        }

        successToast("Updated", "Company picture updated successfully");
        setIsOpen(false);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        id="image"
        ref={fileInputRef}
        className="hidden"
        {...register("image", {
          onChange: handlePhotoChange,
        })}
      />
      <label
        htmlFor="image"
        className="relative block w-32 h-32 border-2 border-dashed rounded-lg overflow-hidden cursor-pointer"
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 rounded-full p-1"
              tabIndex={-1}
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ImagePlus className="w-8 h-8 mb-1" />
            <p className="text-xs">Upload</p>
          </div>
        )}
      </label>
      {errors.image && (
        <p className="text-red-500 text-sm">{errors.image.message}</p>
      )}

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {!isLoading ? (
        <Button type="submit" className="w-full">
          Submit
        </Button>
      ) : (
        <Button type="button" className="w-full">
          <Loader className="animate-spin" />
        </Button>
      )}
    </form>
  );
};
