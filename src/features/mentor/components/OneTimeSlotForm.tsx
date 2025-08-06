import { Calendar, Loader, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { oneTimeSlotSchema } from "../zodeSchema/OneTimeSlotSchema";
import { useEffect } from "react";
import { IoneTimeSlotForm } from "../pages/appointment";



type OneTimeSlotFormData = z.infer<typeof oneTimeSlotSchema>;

interface OneTimeSlotFormProps {
  oneTimeSlot: IoneTimeSlotForm;
  setOneTimeSlot: React.Dispatch<React.SetStateAction<IoneTimeSlotForm>>;
  addOneTimeSlot: () => void;
  calculateEndTime: (startTime: string, duration: number) => string;
  getTodaysDate: () => string;
  timeSlots: string[];
  durationOptions: { value: number; label: string }[];
  createOneSlotLoading: boolean;
}

export const OneTimeSlotForm = ({
  oneTimeSlot,
  setOneTimeSlot,
  addOneTimeSlot,
  calculateEndTime,
  getTodaysDate,
  timeSlots,
  durationOptions,
  createOneSlotLoading,
}: OneTimeSlotFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<OneTimeSlotFormData>({
    resolver: zodResolver(oneTimeSlotSchema),
    defaultValues: oneTimeSlot,
  });

  // Watch individual fields to avoid reference changes
  const date = watch("date");
  const startTime = watch("startTime");
  const duration = watch("duration");
  const description = watch("description");
  const salary = watch("salary");

  // Update parent state when form fields change
  useEffect(() => {
    setOneTimeSlot({
      date: date || "",
      startTime: startTime || "",
      duration: duration || 60,
      salary: salary || 0,
      description: description || "",
    });
  }, [date, startTime, duration, salary, description, setOneTimeSlot]);

  const onSubmit = () => {
    addOneTimeSlot();
    reset({
      date: "",
      startTime: "",
      duration: 60,
      salary: 0,
      description: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Calendar className="text-blue-600" size={20} />
        Add One-Time Slot
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main form fields grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              min={getTodaysDate()}
              {...register("date")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time *
            </label>
            <select
              {...register("startTime")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.startTime && (
              <p className="text-red-500 text-xs mt-1">
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration *
            </label>
            <select
              {...register("duration", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.duration && (
              <p className="text-red-500 text-xs mt-1">
                {errors.duration.message}
              </p>
            )}
            {startTime && (
              <p className="text-xs text-gray-500 mt-1">
                End time: {calculateEndTime(startTime, duration)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary (₹) *
            </label>
            <input
              type="number"
              {...register("salary", { valueAsNumber: true })}
              placeholder="Amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.salary && (
              <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>
            )}
          </div>
        </div>

        {/* Description field - full width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Special consultation session"
            {...register("description")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-start">
          <button
            type={createOneSlotLoading ? "button" : "submit"}
            disabled={createOneSlotLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
          >
            {createOneSlotLoading ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <Plus size={16} />
            )}
            {createOneSlotLoading ? "Adding..." : "Add Slot"}
          </button>
        </div>
      </form>
    </div>
  );
};