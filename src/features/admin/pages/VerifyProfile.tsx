import { IMentor } from "@/@types/interface/IMentor";
import { useVerifyProfile } from "@/hooks/useAdminVerifyProfile";
import { VerifyProfileHeader } from "../components/VerifyProfileHeader";
import { VerifyProfileCard } from "../components/VerifyProfileCard";
import { VerificationModal } from "../components/VerificationModal";
import { ImageZoomModal } from "../components/VerifyImageZoomModal";

const VerifyProfilePage = () => {
  const {
    selectedOption,
    setSelectedOption,
    isModalOpen,
    setIsModalOpen,
    selectedProfile,
    zoomImage,
    setZoomImage,
    profileData,
    isLoading,
    handleVerify,
    handleReject,
    openModal,
    fetchData,
  } = useVerifyProfile();

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    fetchData(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <VerifyProfileHeader
          selectedOption={selectedOption}
          onOptionChange={handleOptionChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileData.length === 0 ? (
            <div className="col-span-full text-center py-6">
              <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                No profiles available to display.
              </h2>
            </div>
          ) : (
            profileData.map((profile: IMentor) => (
              <VerifyProfileCard
                key={profile.id}
                profile={profile}
                onViewDetails={openModal}
              />
            ))
          )}
        </div>

        <VerificationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          profile={selectedProfile}
          onVerify={handleVerify}
          onReject={handleReject}
          onImageZoom={(image, side) => setZoomImage({ url: image, side })}
          isLoading={isLoading}
        />

        <ImageZoomModal
          zoomImage={zoomImage}
          onClose={() => setZoomImage(null)}
        />
      </div>
    </div>
  );
};

export default VerifyProfilePage;
