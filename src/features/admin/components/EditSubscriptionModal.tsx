import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRef, useState } from 'react';
import EditSubscriptionForm from './EditSubscriptionForm';
import { Isubscription } from '@/@types/interface/Isubscription';

export const EditSubscriptionModal = ({ subscription, setPlans }:{ subscription:Isubscription, setPlans: React.Dispatch<React.SetStateAction<Isubscription[]>>; }) => {
  const offerInputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
  

  return (
    <Dialog open={isOpen} >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {subscription.type} Subscription</DialogTitle>
        </DialogHeader>
        <EditSubscriptionForm 
          subscription={subscription} 
          setPlans={setPlans}
          offerInputRef={offerInputRef}
          setIsOpen={setIsOpen}
          />
      </DialogContent>
    </Dialog>
  );
};