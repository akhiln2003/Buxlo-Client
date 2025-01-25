import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { Imentor } from "@/@types/interface/Imentor";
import { Button } from "@/components/ui/button";
import { errorTost } from "@/components/ui/tosastMessage";
import { useFetchProfileImageMutation } from "@/services/apis/CommonApis";
import { useUpdateMentorProfileMutation } from "@/services/apis/MentorApis";
import { PencilIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";

function EditProfileBanner({
  id,
  profileImage,
  setProfileImage,
  setIsPhotoDialogOpen,
  setUsers,
}: {
  id: string;
  profileImage: string;
  setProfileImage: (isPhotoDialogOpen: string) => void;
  setIsPhotoDialogOpen: (isPhotoDialogOpen: boolean) => void;
  setUsers: React.Dispatch<React.SetStateAction<Partial<Imentor>>>;
}) {
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(profileImage);
  const [updateProfile, { isLoading }] = useUpdateMentorProfileMutation();
  const [fetchProfileImages] = useFetchProfileImageMutation();

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const avatar = event.target.files?.[0];

    if (avatar) {
      setNewProfileImage(avatar);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(avatar);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileImage) return;

    try {
      const response: IaxiosResponse = await updateProfile({
        id,
        newProfileImage,
      });
      if (response.data) {
        setUsers((prev) => ({
          ...prev,
          avatar: response.data.data.avatar,
        }));
        const imageUrl: IaxiosResponse = await fetchProfileImages(
          response.data.data.avatar as string
        );
        if (imageUrl.data) {
          setProfileImage(imageUrl.data.imageUrl);
          setIsPhotoDialogOpen(false);
        } else {
          errorTost(
            "Something went wrong ",
            imageUrl.error.data.error || [
              { message: `${imageUrl.error.data} please try again later` },
            ]
          );
        }
      }
    } catch (error) {
      console.error("error:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  const handleCancel = async () => {
    setNewProfileImage(null);
    setPreviewUrl(profileImage);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl h-32 relative overflow-hidden rounded-lg">
          <img
            src={previewUrl}
            alt="Banner preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
            id="avatar"
          />
          <label
            htmlFor="avatar"
            className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {!newProfileImage && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => document.getElementById("avatar")?.click()}
                >
                  <PencilIcon />
                </Button>

                <Button type="button" variant="outline" onClick={handleCancel}>
                  <Trash2 />
                </Button>
              </>
            )}
          </label>
        </div>

        <div className="flex justify-center gap-4">
          {newProfileImage && (
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-24"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          )}

          {newProfileImage && !isLoading && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              <Trash2 />
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Uploading banner...
        </div>
      )}
    </form>
  );
}

export default EditProfileBanner;
