import { useEffect, useState } from "react";
import { CreateModal } from "../components/CreateAdv";
import { ITrustedUs } from "@/@types/interface/ITrustedUs";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { IAdv } from "@/@types/interface/IAdv";
import { errorTost } from "@/components/ui/tosastMessage";
import { Trash2 } from "lucide-react";
import {
  useFetchAdvImageMutation,
  useFetchAdvsDataMutation,
  useFetchtrustedUsDataMutation,
  useFetchTrustedUsImageMutation,
} from "@/services/apis/AdminApis";

import { ConfirmDeletion } from "../components/ConfirmDeletion";
import EditAndDeleteDropdownMenu from "../components/EditAndDeleteDropdownMenu";
import { PageNation } from "@/components/ui/pageNation";

const AdvManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setDeleteIsOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<{
    id: string;
    key: string;
    index: number;
    type: string;
  } | null>(null);
  const [trustedUsPageNationData, setTrustedUsPageNationData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [advPageNationData, setAdvPageNationData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [trustedUsData, setTrustedUsData] = useState<ITrustedUs[]>([]);
  const [advData, setAdvData] = useState<IAdv[]>([]);
  const [trustedUsImage, setTrustedUsImage] = useState<string[]>([]);
  const [advImage, setAdvImage] = useState<string[]>([]);

  const [fetchTrustedUsData] = useFetchtrustedUsDataMutation();
  const [fetchAdvData] = useFetchAdvsDataMutation();
  const [fetchTrustedUsImages] = useFetchTrustedUsImageMutation();
  const [fetchAdvImages] = useFetchAdvImageMutation();

  const fetchAdv = async (page: number = 1) => {
    try {
      const advResponse: IAxiosResponse = await fetchAdvData(page);

      if (advResponse.data.advs) {
        setAdvData(advResponse.data.advs);
        setAdvPageNationData((prev) => ({
          ...prev,
          totalPages: advResponse.data.totalPages,
        }));
        const advKeys: string[] = advResponse.data.advs.map(
          (val: ITrustedUs) => `Adv/${val.image}`
        );

        if (advKeys.length > 0) {
          const trustedUsImageUrls: IAxiosResponse = await fetchAdvImages({
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

  const fetchTrustedUs = async (page: number = 1) => {
    try {
      const trustedUsResponse: IAxiosResponse = await fetchTrustedUsData(page);

      if (trustedUsResponse.data.trustedUs) {
        setTrustedUsData(trustedUsResponse.data.trustedUs);
        setTrustedUsPageNationData((prev) => ({
          ...prev,
          totalPages: trustedUsResponse.data.totalPages,
        }));
        const trustedUsKeys: string[] = trustedUsResponse.data.trustedUs.map(
          (val: ITrustedUs) => `TrustedUs/${val.image}`
        );

        if (trustedUsKeys.length > 0) {
          const trustedUsImageUrls: IAxiosResponse = await fetchTrustedUsImages(
            { keys: trustedUsKeys }
          );
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
    } catch (err) {
      console.error("Error fetching data:", err);
      errorTost("Something went wrong", [
        { message: "Please try again later" },
      ]);
    }
  };

  useEffect(() => {
    fetchAdv();
    fetchTrustedUs();
  }, []);

  const handleDeleteClick = (
    type: "trustedUs" | "advertisement",
    id: string,
    key: string,
    index: number
  ) => {
    setDeleteData({ id, key, index, type });
    setDeleteIsOpen(true);
  };

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-zinc-100">
          ADV Management
        </h1>
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

      {/* Confirmation Modal */}
      <ConfirmDeletion
        isDeleteOpen={isDeleteOpen}
        setDeleteIsOpen={setDeleteIsOpen}
        deleteData={deleteData}
        setTrustedUsImage={setTrustedUsImage}
        setTrustedUsData={setTrustedUsData}
        trustedUsData={trustedUsData}
        setAdvData={setAdvData}
        advData={advData}
        setAdvImage={setAdvImage}
        fetchFunction={
          deleteData?.type == "trustedUs" ? fetchTrustedUs : fetchAdv
        }
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
                  onClick={() =>
                    handleDeleteClick(
                      "trustedUs",
                      item.id as string,
                      item.image,
                      index
                    )
                  }
                  className="absolute top-1 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer bg-white/50 rounded-full p-1"
                />
              </div>
            </div>
          ))}
        </div>
        {trustedUsPageNationData.totalPages > 1 && (
          <div className="w-full h-8  mt-[3rem]  flex justify-end pr-[2rem]">
            <PageNation
              pageNationData={trustedUsPageNationData}
              fetchUserData={fetchTrustedUs}
              setpageNationData={setTrustedUsPageNationData}
            />
          </div>
        )}
      </div>

      <div className="w-full mt-[2rem] p-4 md:p-10">
        <p className="font-cabinet font-semibold mb-10">ADVERTISEMENTS</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {advData.map((item, index) => (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group relative "
            >
              <div className="w-full h-48 flex items-center justify-center relative ">
                <img
                  src={advImage[index]}
                  alt={`Advertisement ${item.id}`}
                  className="w-full h-full object-cover"
                />
                <EditAndDeleteDropdownMenu
                  index={index}
                  item={item}
                  currentImageUrl={advImage[index]}
                  setDeleteData={setDeleteData}
                  setDeleteIsOpen={setDeleteIsOpen}
                  setAdvData={setAdvData}
                  setAdvImage={setAdvImage}
                />
              </div>

              <div className="p-4">
                <p className="font-cabinet font-bold text-center text-lg truncate mb-2 uppercase">
                  {item.title}
                </p>
                <p className="font-cabinet font-light text-center text-sm text-gray-600 dark:text-zinc-300 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {advPageNationData.totalPages > 1 && (
        <div className="w-full h-14  py-2  flex justify-end pr-[2rem]">
          <PageNation
            pageNationData={advPageNationData}
            fetchUserData={fetchAdv}
            setpageNationData={setAdvPageNationData}
          />
        </div>
      )}
    </div>
  );
};

export default AdvManagement;
