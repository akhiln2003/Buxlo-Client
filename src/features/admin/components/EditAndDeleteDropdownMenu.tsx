import { useState } from "react";
import { IAdv } from "@/@types/interface/IAdv";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { EditAdvModal } from "./EditAdvModal";

type DeleteData = {
  id: string;
  key: string;
  index: number;
  type: "advertisement" | "trustedUs";
};

const EditAndDeleteDropdownMenu = ({
  item,
  index,
  setDeleteData,
  setDeleteIsOpen,
  setAdvData,
  currentImageUrl,
  setAdvImage,
}: {
  item: IAdv;
  index: number;
  currentImageUrl: string;
  setDeleteData: (data: DeleteData) => void;
  setDeleteIsOpen: (setDeleteIsOpen: boolean) => void;
  setAdvData: React.Dispatch<React.SetStateAction<IAdv[]>>;
  setAdvImage: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (
    type: "advertisement",
    id: string,
    key: string,
    index: number
  ) => {
    setDeleteData({ id, key, index, type });
    setDeleteIsOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <EllipsisVertical
            size={25}
            className="cursor-pointer bg-white/50 rounded-full p-1"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="absolute right-0">
          <DropdownMenuItem
            onClick={handleEditClick}
            className="flex items-center gap-2"
          >
            <Pencil size={16} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              handleDeleteClick(
                "advertisement",
                item.id as string,
                item.image,
                index
              )
            }
            className="flex items-center gap-2 text-red-600 focus:text-red-600"
          >
            <Trash2 size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditAdvModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        advData={{ ...item, currentImageUrl }}
        setAdvData={setAdvData}
        setAdvImage={setAdvImage}
      />
    </>
  );
};

export default EditAndDeleteDropdownMenu;
