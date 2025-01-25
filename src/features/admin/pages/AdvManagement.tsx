import { useEffect, useState } from "react";
import { CreateModal } from "../components/CreateAdv";
import { ItrustedUs } from "@/@types/interface/ItrustedUs";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { Iadv } from "@/@types/interface/Iadv";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { Trash2 } from "lucide-react";
import {
  useDeleteAdvImageMutation,
  useDeleteTrustedUsImageMutation,
  useFetchAdvImageMutation,
  useFetchAdvsDataMutation,
  useFetchtrustedUsDataMutation,
  useFetchTrustedUsImageMutation,
} from "@/services/apis/AdminApis";

const AdvManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [trustedUsData, setTrustedUsData] = useState<ItrustedUs[]>([]);
  const [advData, setAdvData] = useState<Iadv[]>([]);
  const [trustedUsImage, setTrustedUsImage] = useState<string[]>([]);
  const [advImage, setAdvImage] = useState<string[]>([]);

  const [fetchTrustedUsData] = useFetchtrustedUsDataMutation();
  const [fetchAdvData] = useFetchAdvsDataMutation();
  const [fetchTrustedUsImages] = useFetchTrustedUsImageMutation();
  const [fetchAdvImages] = useFetchAdvImageMutation();
  const [deleteTrustedUsImage] = useDeleteTrustedUsImageMutation();
  const [deleteAdvImage] = useDeleteAdvImageMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trustedUsResponse: IaxiosResponse = await fetchTrustedUsData();
        const advResponse: IaxiosResponse = await fetchAdvData();
        if (trustedUsResponse.data.data) {
          setTrustedUsData(trustedUsResponse.data.data);
          const trustedUsKeys: string[] = trustedUsResponse.data.data.map(
            (val: ItrustedUs) => `TrustedUs/${val.image}`
          );

          if (trustedUsKeys.length > 0) {
            const trustedUsImageUrls: IaxiosResponse =
              await fetchTrustedUsImages({ keys: trustedUsKeys });
            if (trustedUsImageUrls.data.imageUrl) {
              setTrustedUsImage(trustedUsImageUrls.data.imageUrl);
            } else {
              errorTost(
                "Error fetching Trusted Us Images",
                trustedUsImageUrls.error.data.error
              );
            }
          }
        }
        if (advResponse.data.data) {
          setAdvData(advResponse.data.data);
          const advKeys: string[] = advResponse.data.data.map(
            (val: ItrustedUs) => `Adv/${val.image}`
          );

          if (advKeys.length > 0) {
            const trustedUsImageUrls: IaxiosResponse = await fetchAdvImages({
              keys: advKeys,
            });

            if (trustedUsImageUrls.data.imageUrl) {
              setAdvImage(trustedUsImageUrls.data.imageUrl);
            } else {
              errorTost(
                "Error fetching Adv Images",
                trustedUsImageUrls.error.data.error
              );
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        errorTost("Something went wrong", [
          { message: "Please try again later" },
        ]);
      }
    };

    fetchData();
  }, []);

  const handilDeleteTrustedUs = async (
    id: string,
    key: string,
    index: number
  ) => {
    try {
      const response: IaxiosResponse = await deleteTrustedUsImage({ id, key });

      if (response.data) {
        const data = trustedUsData.filter((val) => val.id != id);
        setTrustedUsData(data);
        const images = trustedUsImage.filter((_, i) => i != index);
        setTrustedUsImage(images);
        successToast(
          "Updated",
          response.data.response.data
            ? response.data.response.data
            : "Profile picture updated successfully"
        );
      } else {
        errorTost(
          "Something went wrong ",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handilDeleteAdv = async (id: string, key: string, index: number) => {
    try {
      const response: IaxiosResponse = await deleteAdvImage({ id, key });

      if (response.data) {
        const data = advData.filter((val) => val.id != id);
        setAdvData(data);
        const images = advImage.filter((_, i) => i != index);
        setAdvImage(images);
        successToast(
          "Updated",
          response.data.response.data
            ? response.data.response.data
            : "Profile picture updated successfully"
        );
      } else {
        errorTost(
          "Something went wrong ",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="w-full h-full p-4">
      <div className="w-full">
        <p className="font-cabinet font-medium text-xl">
          Advertisement Management
        </p>
      </div>
      <div className="w-full flex justify-end mt-2 px-2 md:px-5">
        <div
          className="border border-black dark:border-white w-auto md:w-1/12 h-10 flex justify-center items-center cursor-pointer px-4 md:px-0"
          onClick={() => setIsOpen(true)}
        >
          Create
        </div>
      </div>

      <CreateModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setTrustedUsImage={setTrustedUsImage}
        setTrustedUsData={setTrustedUsData}
        setAdvData={setAdvData}
        setAdvImage={setAdvImage}
      />

      <div className="w-full mt-[2rem] p-4 md:p-10 ">
        <p className="font-cabinet font-semibold mb-10">TRUSTED US</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {trustedUsData.map((item, index) => (
            <div
              key={item.id}
              className="group relative flex flex-col items-center  justify-center "
            >
              <div className="relative w-full  flex items-center justify-center  ">
                <img
                  src={trustedUsImage[index]}
                  alt={`Trusted Us ${item.id}`}
                  className="max-w-full max-h-full object-contain shadow-lg rounded-md"
                />
                <Trash2
                  // size={15}
                  onClick={() =>
                    handilDeleteTrustedUs(item.id as string, item.image, index)
                  }
                  className="absolute top-1 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer bg-white/50 rounded-full p-1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mt-[2rem] p-4 md:p-10">
        <p className="font-cabinet font-semibold mb-10">ADVERTISEMENTS</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {advData.map((item, index) => (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group relative"
            >
              <div className="w-full h-48 flex items-center justify-center relative">
                <img
                  src={advImage[index]}
                  alt={`Advertisement ${item.id}`}
                  className="w-full h-full object-cover"
                />
                <Trash2
                  size={20}
                  onClick={() =>
                    handilDeleteAdv(item.id as string, item.image, index)
                  }
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer bg-white/50 rounded-full p-1"
                />
              </div>
              <div className="p-4">
                <p className="font-cabinet font-bold text-center text-lg truncate mb-2 uppercase">
                  {item.title}
                </p>
                <p className="font-cabinet font-light text-center text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvManagement;
