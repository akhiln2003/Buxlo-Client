import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { Button } from "@/components/ui/button";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { Loader, PencilIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import { Iuser } from "@/@types/interface/Iuser";
import {
  useDeleteUserProfileImageMutation,
  useFetchUserProfileImageMutation,
  useUpdateUserProfileMutation,
} from "@/services/apis/UserApis";

function EditProfilePhoto({
  id,
  profileImage,
  setProfileImage,
  setIsPhotoDialogOpen,
  setUsers,
  avatar,
}: {
  id: string;
  profileImage: string;
  setProfileImage: (isPhotoDialogOpen: string) => void;
  setIsPhotoDialogOpen: (isPhotoDialogOpen: boolean) => void;
  setUsers: React.Dispatch<React.SetStateAction<Partial<Iuser>>>;
  avatar: string;
}) {
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(profileImage);
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateUserProfileMutation();
  const [fetchProfileImages] = useFetchUserProfileImageMutation();
  const [deleteProfileImages, { isLoading: isDeleting }] =
    useDeleteUserProfileImageMutation();

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
      console.log(id, newProfileImage, avatar);

      const response: IaxiosResponse = await updateProfile({
        id,
        newProfileImage,
        currentProfileImage: avatar,
      });

      if (response.data.data) {
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

          successToast("Updated", "Profile picture updated successfully");
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
    const response: IaxiosResponse = await deleteProfileImages({
      id,
      key: avatar,
    });

    if (response.data) {
      setIsPhotoDialogOpen(false);
      setProfileImage("");

      successToast("Removed", "Profile picture removed successfully");
    } else {
      errorTost(
        "Something went wrong ",
        response.error.data.error || [
          { message: `${response.error.data} please try again later` },
        ]
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <div className="flex justify-center">
        <img
          src={previewUrl ? previewUrl : dummyProfileImage}
          alt="Profile preview"
          className="rounded-full w-32 h-32 object-cover"
        />
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
                {!isDeleting && (
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => document.getElementById("avatar")?.click()}
                  >
                    <PencilIcon />
                  </Button>
                )}

                {avatar && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    {!isDeleting ? (
                      <Trash2 />
                    ) : (
                      <Loader className="animate-spin" />
                    )}
                  </Button>
                )}
              </>
            )}
          </label>
        </div>

        <div className="flex justify-center gap-4">
          {newProfileImage && (
            <Button
              type="submit"
              variant="default"
              disabled={isUpdatingProfile}
              className="w-24"
            >
              {isUpdatingProfile ? "Saving..." : "Save"}
            </Button>
          )}

          {newProfileImage && !isUpdatingProfile && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              {!isDeleting ? <Trash2 /> : <Loader className="animate-spin" />}
            </Button>
          )}
        </div>
      </div>

      {isUpdatingProfile && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Uploading photo...
        </div>
      )}
    </form>
  );
}

export default EditProfilePhoto;
