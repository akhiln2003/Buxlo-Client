import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ISubscription } from "@/@types/interface/ISubscription";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { useAddSubscriptionPlanMutation } from "@/services/apis/AdminApis";

interface AddSubscriptionFormProps {
  plans: ISubscription[];
  setPlans: React.Dispatch<React.SetStateAction<ISubscription[]>>;
  setIsOpen: (open: boolean) => void;
}

const AddSubscriptionForm = ({
  plans,
  setPlans,
  setIsOpen,
}: AddSubscriptionFormProps) => {
  const [addPlans] = useAddSubscriptionPlanMutation();
  const [formData, setFormData] = useState({
    type: "",
    price: "",
    offer: "",
    duration: "",
  });
  const [errors, setErrors] = useState<{
    type?: string;
    price?: string;
    offer?: string;
    duration?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.type.trim()) {
      newErrors.type = "Plan type is required";
    } else if (plans.some((p) => p.type.toLowerCase() === formData.type.toLowerCase())) {
      newErrors.type = "A plan with this type already exists";
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    const offer = parseFloat(formData.offer);
    if (formData.offer && (isNaN(offer) || offer < 0 || offer > 100)) {
      newErrors.offer = "Offer must be between 0 and 100";
    }

    const duration = parseInt(formData.duration);
    if (!formData.duration || isNaN(duration) || duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newPlan = {
        type: formData.type.trim(),
        price: parseFloat(formData.price),
        offer: formData.offer ? parseFloat(formData.offer) : 0,
        duration: parseInt(formData.duration),
      };

      const response: IAxiosResponse = await addPlans([newPlan]);
      
      if (response.data?.newPlans) {
        setPlans([...plans, ...response.data.newPlans]);
        successToast("Plan Added", "Subscription plan added successfully");
        setIsOpen(false);
      } else {
        errorTost(
          "Failed to add plan",
          response.error?.data?.error || [
            { message: "Unable to add subscription plan" },
          ]
        );
      }
    } catch (err) {
      console.error("Error adding plan:", err);
      errorTost("Failed to add plan", [
        { message: "Unable to add subscription plan" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">Plan Type *</Label>
        <Input
          id="type"
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value)}
          placeholder="e.g., Week, Quarter, Lifetime"
          className={errors.type ? "border-red-500" : ""}
        />
        {errors.type && (
          <p className="text-sm text-red-500 mt-1">{errors.type}</p>
        )}
      </div>

      <div>
        <Label htmlFor="duration">Duration (days) *</Label>
        <Input
          id="duration"
          type="number"
          value={formData.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          placeholder="e.g., 1, 7, 30, 365"
          min="1"
          step="1"
          className={errors.duration ? "border-red-500" : ""}
        />
        {errors.duration && (
          <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Common values: 1 (Day), 7 (Week), 30 (Month), 365 (Year)
        </p>
      </div>

      <div>
        <Label htmlFor="price">Price (₹) *</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => handleChange("price", e.target.value)}
          placeholder="0"
          min="0"
          step="0.01"
          className={errors.price ? "border-red-500" : ""}
        />
        {errors.price && (
          <p className="text-sm text-red-500 mt-1">{errors.price}</p>
        )}
      </div>

      <div>
        <Label htmlFor="offer">Offer (%) - Optional</Label>
        <Input
          id="offer"
          type="number"
          value={formData.offer}
          onChange={(e) => handleChange("offer", e.target.value)}
          placeholder="0"
          min="0"
          max="100"
          step="1"
          className={errors.offer ? "border-red-500" : ""}
        />
        {errors.offer && (
          <p className="text-sm text-red-500 mt-1">{errors.offer}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Plan"}
        </Button>
      </div>
    </div>
  );
};

export default AddSubscriptionForm;