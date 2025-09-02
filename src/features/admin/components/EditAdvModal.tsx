import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdvForm } from "./AdvForm"; // Your existing form component
import { IAdv } from "@/@types/interface/IAdv";

interface EditAdvModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  advData: IeditData;
  setAdvData: React.Dispatch<React.SetStateAction<IAdv[]>>;
  setAdvImage: React.Dispatch<React.SetStateAction<string[]>>;
}

interface IeditData extends IAdv {
  currentImageUrl: string;
}
export const EditAdvModal = ({
  isOpen,
  setIsOpen,
  advData,
  setAdvData,
  setAdvImage,
}: EditAdvModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Advertisement</DialogTitle>
        </DialogHeader>
        <AdvForm
          setIsOpen={setIsOpen}
          setAdvData={setAdvData}
          setAdvImage={setAdvImage}
          editMode={true}
          editData={advData}
        />
      </DialogContent>
    </Dialog>
  );
};
