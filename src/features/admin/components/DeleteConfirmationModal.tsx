import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ISubscription } from "@/@types/interface/ISubscription";

type DeleteConfirmationModalProps = {
  subscription: ISubscription;
  onDeleteConfirm: (subscription: ISubscription) => void;
  isFixedPlan: boolean;
};

export const DeleteConfirmationModal = ({
  subscription,
  onDeleteConfirm,
  isFixedPlan,
}: DeleteConfirmationModalProps) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDeleteConfirm(subscription);
    setOpen(false);
  };

  if (isFixedPlan) {
    return null;
  }

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 h-8 w-8 p-0"
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
              </div>
              <DialogTitle className="text-xl">Delete Subscription Plan</DialogTitle>
            </div>
            <DialogDescription className="pt-3 text-base">
              Are you sure you want to delete the{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {subscription.type}
              </span>{" "}
              plan (₹{subscription.price})?
              <br />
              <span className="text-red-600 dark:text-red-400 font-medium">
                This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};