import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import {
    useDeleteAdvImageMutation,
    useDeleteTrustedUsImageMutation,
  } from "@/services/apis/AdminApis";
  import { errorTost, successToast } from "@/components/ui/tosastMessage";
  import { Loader2 } from "lucide-react";
  import { ItrustedUs } from "@/@types/interface/ItrustedUs";
  import { Iadv } from "@/@types/interface/Iadv";
  
  export const ConfirmDeletion = ({
    isDeleteOpen,
    setDeleteIsOpen,
    deleteData,
    setTrustedUsImage,
    setTrustedUsData,
    trustedUsData,
    setAdvData,
    advData,
    setAdvImage,
    fetchFunction
  }: {
    isDeleteOpen: boolean;
    setDeleteIsOpen: (value: boolean) => void;
    deleteData: { id: string; key: string; index: number; type: string } | null;
    setTrustedUsImage: React.Dispatch<React.SetStateAction<string[]>>;
    setTrustedUsData: React.Dispatch<React.SetStateAction<ItrustedUs[]>>;
    trustedUsData:ItrustedUs[];
    setAdvData: React.Dispatch<React.SetStateAction<Iadv[]>>;
    advData:Iadv[];
    setAdvImage: React.Dispatch<React.SetStateAction<string[]>>;
    fetchFunction:() => Promise<void>
  }) => {
    const [deleteTrustedUsImage, { isLoading: isDeletingTrustedUs }] =
      useDeleteTrustedUsImageMutation();
    const [deleteAdvImage, { isLoading: isDeletingAdv }] =
      useDeleteAdvImageMutation();
  
    const handleDelete = async () => {
      if (!deleteData) return;
  
      try {
        const deleteMutation =
          deleteData.type === "trustedUs" ? deleteTrustedUsImage : deleteAdvImage;
        const response = await deleteMutation(deleteData).unwrap();
  
        // Update states based on deletion type
        if (deleteData.type === "trustedUs") {
          setTrustedUsData((prevData) =>
            prevData.filter((item) => item.id !== deleteData.id)
          );
          setTrustedUsImage((prevImages) =>
            prevImages.filter((_, index) => index !== deleteData.index)
          );
          if( trustedUsData.length <= 1){
            fetchFunction()
          }
        } else {
          setAdvData((prevData) =>
            prevData.filter((item) => item.id !== deleteData.id)
          );
          setAdvImage((prevImages) =>
            prevImages.filter((_, index) => index !== deleteData.index)
          );

          if( advData.length <= 1){
            fetchFunction()
          }
        }
  
        successToast(
          "Success",
          response?.data?.message || "Item deleted successfully."
        );
        setDeleteIsOpen(false);
      } catch (error) {
        console.error(error);
        errorTost("Something went wrong", [
          { message: "Failed to delete. Please try again later." },
        ]);
      }
    };
  
    return (
      <Dialog open={isDeleteOpen} onOpenChange={setDeleteIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeletingTrustedUs || isDeletingAdv}
            >
              {isDeletingTrustedUs || isDeletingAdv ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };