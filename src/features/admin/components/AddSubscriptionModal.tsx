import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import AddSubscriptionForm from "./AddSubscriptionForm";
import { ISubscription } from "@/@types/interface/ISubscription";

export const AddSubscriptionModal = ({
  plans,
  setPlans,
}: {
  plans: ISubscription[];
  setPlans: React.Dispatch<React.SetStateAction<ISubscription[]>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subscription Plan</DialogTitle>
        </DialogHeader>
        <AddSubscriptionForm
          plans={plans}
          setPlans={setPlans}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
};