import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, CheckCircle, XCircle, Maximize2 } from "lucide-react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    id: string;
    name: string;
    aadhaarNumb: string;
    friendImage: string;
    backImage: string;
  } | null;
  onVerify: (id: string, name: string) => void;
  onReject: (id: string, name: string) => void;
  onImageZoom: (image: string, side: string) => void;
  isLoading: boolean;
}

export const VerificationModal = ({
  isOpen,
  onClose,
  profile,
  onVerify,
  onReject,
  onImageZoom,
  isLoading,
}: VerificationModalProps) => {
  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Profile Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aadhaar: {profile.aadhaarNumb}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                title: "Front Image",
                image: profile.friendImage,
                side: "front",
              },
              { title: "Back Image", image: profile.backImage, side: "back" },
            ].map((item) => (
              <div key={item.side} className="space-y-2">
                <p className="text-sm font-medium">{item.title}</p>
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group">
                  <img
                    src={item.image}
                    alt={`Aadhaar ${item.side}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={() => onImageZoom(item.image, item.side)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={() => onReject(profile.id, profile.name)}
              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => onVerify(profile.id, profile.name)}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
