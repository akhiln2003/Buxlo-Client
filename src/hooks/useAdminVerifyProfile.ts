import { useState, useEffect, useContext } from "react";
import { Imentor } from "@/@types/interface/Imentor";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import {
  useAdminUpdateVerifyProfileMutation,
  useFetchVerifyProfileDataMutation,
  useFethAadhaarImagesMutation,
} from "@/services/apis/AdminApis";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { SocketContext } from "@/contexts/socketContext";
import { useCreateNotificationMutation } from "@/services/apis/CommonApis";

export const useVerifyProfile = () => {
  const [selectedOption, setSelectedOption] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{
    id: string;
    name: string;
    aadhaarNumb: string;
    friendImage: string;
    backImage: string;
  } | null>(null);
  const [zoomImage, setZoomImage] = useState<{
    url: string;
    side: string;
  } | null>(null);
  const [profileData, setProfileData] = useState<Imentor[]>([]);

  const [fetchProfileData] = useFetchVerifyProfileDataMutation();
  const [fetchAadhaarImages] = useFethAadhaarImagesMutation();
  const [updateVerifyStatus, { isLoading }] =
    useAdminUpdateVerifyProfileMutation();
  const socketContext = useContext(SocketContext);
  const [createNotification] = useCreateNotificationMutation();

  const handleVerify = async (
    id: string,
    name: string,
    verified = "verified"
  ) => {
    try {
      console.log("top verifiy", id, name, verified);

      const response: IaxiosResponse = await updateVerifyStatus({
        id,
        verified,
      });
      console.log("response in verify ", response);

      if (response.data) {
        setProfileData((prevData) =>
          prevData.map((profile) =>
            profile.id === id ? { ...response.data.updatedData } : profile
          )
        );
        setIsModalOpen(false);
        successToast(
          "Verified Profile",
          `${name} profile verification accepted`
        );
        const notificationResponse = await createNotification({
          recipient: id,
          type: "success",
          message: "Your profile verification is successfuly completed",
          status: "unread",
        }).unwrap();

        if (notificationResponse.notification) {
          socketContext?.notificationSocket?.emit("direct_notification", {
            receiverId: id,
            notification: notificationResponse.notification,
          });
        } else {
          console.error("No notification data returned", response.error);
        }
      } else {
        errorTost("Failed to update verify status", response.error.data.error);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      errorTost("Something went wrong", [
        { message: "Please try again later" },
      ]);
    }
  };

  const handleReject = async (
    id: string,
    name: string,
    verified = "applicationPending"
  ) => {
    try {
      const user = profileData.find((profile) => profile.id === id);
      if (!user) return;

      const unsetData = {
        aadhaarFrontImage: user.aadhaarFrontImage,
        aadhaarBackImage: user.aadhaarBackImage,
        aadhaarName: user.aadhaarName,
        aadhaarNumber: user.aadhaarNumber,
      };

      const response: IaxiosResponse = await updateVerifyStatus({
        id,
        verified,
        unsetData,
      });

      if (response.data) {
        setProfileData((prevData) =>
          prevData.map((profile) =>
            profile.id === id ? { ...response.data.updatedData } : profile
          )
        );
        setIsModalOpen(false);
        successToast(
          "Application rejected",
          `${name} profile verification rejected`
        );
        const notificationResponse = await createNotification({
          recipient: id,
          type: "error",
          message:
            "Your profile verification is faild please apply with currect details",
          status: "unread",
        }).unwrap();
        if (notificationResponse.notification) {
          socketContext?.notificationSocket?.emit("direct_notification", {
            receiverId: id,
            notification: notificationResponse.notification,
          });
        } else {
          console.error("No notification data returned", response.error);
        }
      } else {
        errorTost("Failed to update verify status", response.error.data.error);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      errorTost("Something went wrong", [
        { message: "Please try again later" },
      ]);
    }
  };

  const openModal = async (profile: Imentor) => {
    try {
      const response: IaxiosResponse = await fetchAadhaarImages([
        `Kyc/${profile.aadhaarFrontImage}`,
        `Kyc/${profile.aadhaarBackImage}`,
      ]);

      if (response.data) {
        setSelectedProfile({
          id: profile.id as string,
          name: profile.aadhaarName as string,
          aadhaarNumb: profile.aadhaarNumber as string,
          friendImage: response.data.imageUrl[0],
          backImage: response.data.imageUrl[1],
        });
        setIsModalOpen(true);
      } else {
        errorTost("Something went wrong", response.error.data.error);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      errorTost("Something went wrong", [
        { message: "Please try again later" },
      ]);
    }
  };

  const fetchData = async (
    verified: string,
    page = 1,
    searchData = undefined
  ) => {
    const response: IaxiosResponse = await fetchProfileData({
      page,
      searchData,
      verified,
    });

    if (response.data) {
      setProfileData(response.data.datas);
    } else {
      errorTost("Something went wrong", response.error.data.error);
    }
  };

  useEffect(() => {
    fetchData("all");
  }, []);

  return {
    selectedOption,
    setSelectedOption,
    isModalOpen,
    setIsModalOpen,
    selectedProfile,
    setSelectedProfile,
    zoomImage,
    setZoomImage,
    profileData,
    isLoading,
    handleVerify,
    handleReject,
    openModal,
    fetchData,
  };
};
