import { Clock, Loader, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayOfWeek, IrecurringForm } from "../pages/appointment";
import { recurringFormSchema } from "../zodeSchema/RecurringFormSchema";
import { useEffect } from "react";

type RecurringFormData = z.infer<typeof recurringFormSchema>;

interface RecurringAvailabilityFormProps {
  recurringForm: IrecurringForm;
  setRecurringForm: React.Dispatch<React.SetStateAction<IrecurringForm>>;
  addRecurringRule: () => void;
  calculateEndTime: (startTime: string, duration: number) => string;
  getTodaysDate: () => string;
  timeSlots: string[];
  durationOptions: { value: number; label: string }[];
  createRecurringSlotLoading: boolean;
}

export const RecurringAvailabilityForm = ({
  recurringForm,
  setRecurringForm,
  addRecurringRule,
  calculateEndTime,
  getTodaysDate,
  timeSlots,
  durationOptions,
  createRecurringSlotLoading,
}: RecurringAvailabilityFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<RecurringFormData>({
    resolver: zodResolver(recurringFormSchema),
    defaultValues: recurringForm,
  });

  // Watch individual fields to avoid reference changes
  const startTime = watch("startTime");
  const duration = watch("duration");
  const days = watch("days");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const salary = watch("salary");
  const description = watch("description");

  // Update parent state when form fields change
  useEffect(() => {
    setRecurringForm({
      days: days || [],
      startTime: startTime || "",
      duration: duration || 60,
      startDate: startDate || "",
      endDate: endDate || "",
      salary: salary || 0,
      description: description || "",
    });
  }, [
    startTime,
    duration,
    days,
    startDate,
    endDate,
    salary,
    description,
    setRecurringForm,
  ]);

  const handleDayToggle = (day: string) => {
    const updatedDays = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];
    setValue("days", updatedDays);
  };

  const onSubmit = () => {
    addRecurringRule();
    // Reset form after submission
    reset({
      days: [],
      startTime: "",
      duration: 60,
      startDate: "",
      endDate: "",
      salary: 0,
      description: "",
    });
  };

  const daysOfWeek: DayOfWeek[] = [
    { label: "Sun", value: "Sunday" },
    { label: "Mon", value: "Monday" },
    { label: "Tue", value: "Tuesday" },
    { label: "Wed", value: "Wednesday" },
    { label: "Thu", value: "Thursday" },
    { label: "Fri", value: "Friday" },
    { label: "Sat", value: "Saturday" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="text-purple-600" size={20} />
        Add Recurring Availability
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              placeholder="salary"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.salary && (
              <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>
            )}
          </div>
          
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Days of Week *
          </label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <label
                key={day.value}
                className="flex items-center bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={days.includes(day.value)}
                  onChange={() => handleDayToggle(day.value)}
                  className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 font-medium">
                  {day.label}
                </span>
              </label>
            ))}
          </div>
          {errors.days && (
            <p className="text-red-500 text-xs mt-1">{errors.days.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              min={getTodaysDate()}
              {...register("startDate")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              min={startDate || getTodaysDate()}
              {...register("endDate")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Weekly consultation slot"
            {...register("description")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
        >
          {createRecurringSlotLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          Add Recurring Rule
        </button>
      </form>
    </div>
  );
};
