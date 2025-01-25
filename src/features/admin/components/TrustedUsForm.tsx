import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Loader, X } from "lucide-react";
import { useState } from "react";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import {
  useCreateTrustedUsMutation,
  useFetchTrustedUsImageMutation,
} from "@/services/apis/AdminApis";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { ItrustedUs } from "@/@types/interface/ItrustedUs";

interface FormInputs {
  image: FileList;
}

export const TrustedUsForm = ({
  setIsOpen,
  setTrustedUsImage,
  setTrustedUsData,
}: {
  setIsOpen: (setIsOpen: boolean) => void;
  setTrustedUsImage: React.Dispatch<React.SetStateAction<string[]>>;
  setTrustedUsData: React.Dispatch<React.SetStateAction<ItrustedUs[]>>;
}) => {
  const { register, handleSubmit, setValue } = useForm<FormInputs>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadImage, { isLoading }] = useCreateTrustedUsMutation();
  const [fetchTrustedUsImages] = useFetchTrustedUsImageMutation();

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
    setValue("image", new DataTransfer().files); // Reset image field
  };

  const onSubmit = async (data: FormInputs) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    try {
      const image = data.image[0];
      const response: IaxiosResponse = await uploadImage({ image });
      if (response.data.data) {
        const value: ItrustedUs = response.data.data;

        if (value.image) {
          const keys: string[] = [`TrustedUs/${value.image}`];
          const trustedUsImageUrls: IaxiosResponse = await fetchTrustedUsImages(
            {
              keys: keys,
            }
          );
          if (trustedUsImageUrls.data.imageUrl) {
            setTrustedUsImage((prev) => [
              ...prev,
              ...trustedUsImageUrls.data.imageUrl,
            ]);
            setTrustedUsData((prev) => [...prev, value]);
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 flex flex-col items-center"
    >
      <Input
        type="file"
        accept="image/*"
        id="image"
        className="hidden"
        {...register("image", {
          required: true,
          onChange: handlePhotoChange,
        })}
      />
      <label
        htmlFor="image"
        className="relative block w-64 h-20 border-2 border-dashed rounded-lg overflow-hidden cursor-pointer"
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-fill"
            />
            {!isLoading && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 rounded-full p-1"
                tabIndex={-1}
                aria-label="Remove image"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ImagePlus className="w-8 h-8 mb-1" />
            <p className="text-xs">Upload Logo</p>
          </div>
        )}
      </label>
      {!isLoading ? (
        <Button type="submit" className="w-full max-w-64">
          Submit
        </Button>
      ) : (
        <Button type="button" className="w-full max-w-64">
          <Loader className="animate-spin" />
        </Button>
      )}
    </form>
  );
};

export default TrustedUsForm;
