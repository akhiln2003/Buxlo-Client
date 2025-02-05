import { Dialog, DialogContent, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageZoomModalProps {
  zoomImage: { url: string; side: string } | null;
  onClose: () => void;
}

export const ImageZoomModal = ({ zoomImage, onClose }: ImageZoomModalProps) => (
  <Dialog open={!!zoomImage} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[800px] p-0">
      <DialogHeader className="absolute top-2 right-2 z-10">
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>
      </DialogHeader>
      {zoomImage && (
        <div className="relative w-full h-[80vh]">
          <img
            src={zoomImage.url}
            alt={`Aadhaar ${zoomImage.side}`}
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </DialogContent>
  </Dialog>
);