// CreateModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { TrustedUsForm } from "./TrustedUsForm";
import { AdvForm } from "./AdvForm";
import { ITrustedUs } from "@/@types/interface/ITrustedUs";
import { IAdv } from "@/@types/interface/IAdv";

export const CreateModal = ({
  isOpen,
  setIsOpen,
  setTrustedUsImage,
  setTrustedUsData,
  setAdvData,
  setAdvImage,
}: {
  isOpen: boolean;
  setIsOpen: (setIsOpen: boolean) => void;
  setTrustedUsImage: React.Dispatch<React.SetStateAction<string[]>>;
  setTrustedUsData: React.Dispatch<React.SetStateAction<ITrustedUs[]>>;
  setAdvData: React.Dispatch<React.SetStateAction<IAdv[]>>;
  setAdvImage: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form state when closing
      setSelectedOption("");
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedOption} value={selectedOption}>
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trusted">Trusted Us</SelectItem>
              <SelectItem value="adv">ADV</SelectItem>
            </SelectContent>
          </Select>

          {selectedOption === "trusted" && (
            <TrustedUsForm
              setIsOpen={setIsOpen}
              setTrustedUsImage={setTrustedUsImage}
              setTrustedUsData={setTrustedUsData}
            />
          )}
          {selectedOption === "adv" && (
            <AdvForm
              setIsOpen={setIsOpen}
              setAdvData={setAdvData}
              setAdvImage={setAdvImage}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
