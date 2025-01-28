import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Iadv } from "@/@types/interface/Iadv";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import {
  useCreateAdvMutation,
  useEditAdvMutation,
  useFetchAdvImageMutation,
} from "@/services/apis/AdminApis";
import {
  CreateAdvFormSchema,
  EditAdvFormSchema,
} from "../zodeSchema/AdvFormSchema";
import { z } from "zod";

type FormInputs = z.infer<typeof CreateAdvFormSchema>;

interface IeditData extends Iadv {
  currentImageUrl: string;
}

export const AdvForm = ({
  setIsOpen,
  setAdvData,
  setAdvImage,
  editMode = false,
  editData,
}: {
  setIsOpen: (setIsOpen: boolean) => void;
  setAdvData: React.Dispatch<React.SetStateAction<Iadv[]>>;
  setAdvImage: React.Dispatch<React.SetStateAction<string[]>>;
  editMode?: boolean;
  editData?: IeditData;
}) => {
  const [initialValues, setInitialValues] = useState<{
    title: string;
    description: string;
    image?: FileList;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(editMode ? EditAdvFormSchema : CreateAdvFormSchema),
  });

  const [createAdv, { isLoading: isCreating }] = useCreateAdvMutation();
  const [updateAdv, { isLoading: isUpdating }] = useEditAdvMutation();
  const [fetchAdvImages] = useFetchAdvImageMutation();

  // Watch form values for change detection
  const formValues = watch();

  useEffect(() => {
    if (editMode && editData) {
      const initialData = {
        title: editData.title,
        description: editData.description,
        image: undefined, // No initial image file
      };
      setInitialValues(initialData);
      setValue("title", editData.title);
      setValue("description", editData.description);
      if (editData.image) {
        setPreviewUrl(`${editData.currentImageUrl}`);
      }
    }
  }, [editMode, editData, setValue]);

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

    // Create an empty FileList-like object
    const emptyFileList = Object.create(FileList.prototype);
    Object.defineProperty(emptyFileList, "length", { value: 0 });

    setValue("image", emptyFileList);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasChanges = () => {
    if (!initialValues || !editMode) return true;

    const formDataChanged =
      initialValues.title !== formValues.title ||
      initialValues.description !== formValues.description;

    const imageChanged = formValues.image && formValues.image.length > 0;

    return formDataChanged || imageChanged;
  };

  const onSubmit = async (data: FormInputs) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Check if there are any changes in edit mode
    if (editMode && !hasChanges()) {
      errorTost("No Changes", [{ message: "No changes were made" }]);
      return;
    }

    try {
      const formData = new FormData();

      // Append only the changed fields
      if (data.title?.trim() !== initialValues?.title) {
        formData.append("data[title]", data.title.trim());
      }
      if ( editMode && 
        data.title?.trim() !== initialValues?.title ||
        data.description?.trim() !== initialValues?.description ||
        data.image?.length > 0 
      ) {
        formData.append("data[id]", editData?.id as string);
        formData.append("data[currentImage]", editData?.image as string);

      }

      if (data.description?.trim() !== initialValues?.description) {
        formData.append("data[description]", data.description.trim());
      }


      

      // Only append image if it exists and has changed
      if (data.image?.length > 0) {
        formData.append("image", data.image[0]);
        
      }

      // Check if FormData is empty
      if ([...formData.entries()].length === 0) {
        errorTost("Validation Error", [{ message: "No data to submit" }]);
        return;
      }

      const response: IaxiosResponse =
        editMode && editData
          ? await updateAdv(formData)
          : await createAdv(formData);

      if (response.data.responseData) {
        const value: Iadv = response.data.responseData;

        if (value.image) {
          const keys: string[] = [`Adv/${value.image}`];
          const imageUrls: IaxiosResponse = await fetchAdvImages({
            keys: keys,
          });

          if (imageUrls.data.imageUrl) {
            if (editMode) {
              setAdvData((prev) =>
                prev.map((item) => (item.id === editData?.id ? value : item))
              );
              setAdvImage((prev) => {
                const newImages = [...prev];
                const index = prev.findIndex((url) =>
                  url.includes(editData?.image || "")
                );
                if (index !== -1) {
                  newImages[index] = imageUrls.data.imageUrl[0];
                }
                return newImages;
              });
            } else {
              setAdvImage((prev) => [...prev, ...imageUrls.data.imageUrl]);
              setAdvData((prev) => [...prev, value]);
            }
          } else {
            errorTost("Error fetching Images", imageUrls.error.data.error);
          }
        }

        successToast(
          editMode ? "Updated" : "Created",
          `Advertisement ${editMode ? "updated" : "created"} successfully`
        );
        setIsOpen(false);
        if (!editMode) {
          reset();
        }
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

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        id="image"
        className="hidden"
        {...register("image", {
          onChange: handlePhotoChange,
          required: !editMode,
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
          {editMode ? "Update" : "Submit"}
        </Button>
      ) : (
        <Button type="button" className="w-full">
          <Loader className="animate-spin" />
        </Button>
      )}
    </form>
  );
};
