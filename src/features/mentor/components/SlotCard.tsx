import { Calendar, CheckCircle, Loader, Trash2, X } from "lucide-react";
import { Slot } from "../pages/appointment";
import { useCancelBookingMutation, useDeleteSlotMutation } from "@/services/apis/MentorApis";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { errorTost, successToast } from "@/components/ui/tosastMessage";

// SlotCard Component
interface SlotCardProps {
  slot: Slot;
  setSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
  formatDuration: (duration: number) => string;
  calculateEndTime: (startTime: string, duration: number) => string;
}

export const SlotCard = ({
  slot,
  setSlots,
  formatDuration,
  calculateEndTime,
}: SlotCardProps) => {
  const [slotDelete, { isLoading: deleteSlotIsLoading }] =
    useDeleteSlotMutation();
  const [cancelBooking, { isLoading: cancelBookingIsLoading }] =
    useCancelBookingMutation();

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "booked":
        return "bg-red-100 text-red-800 border-red-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isTimeGreaterThan24Hours = (): boolean => {
    const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);
    const currentDateTime = new Date();
    const timeDifference = slotDateTime.getTime() - currentDateTime.getTime();
    const hoursRemaining = timeDifference / (1000 * 60 * 60);
    return hoursRemaining > 24;
  };

  const shouldShowCancelButton = (): boolean => {
    return slot.isBooked && isTimeGreaterThan24Hours();
  };

  const shouldShowDeleteButton = (): boolean => {
    return slot.status !== "booked" || isTimeGreaterThan24Hours();
  };

  const deleteSlot = async (id: string) => {
    try {
      const response: IAxiosResponse = await slotDelete(id);
      if (response.data) {
        successToast("Deleted", "Slot deletion successful");
        setSlots((prev) => prev.filter((slot) => slot.id !== id));
      } else {
        errorTost(
          "Something went wrong",
          response.error.data.error || [
            { message: "Something went wrong please try again" },
          ]
        );
      }
    } catch (error) {
      console.error("Error deleting slot:", error);
      errorTost("Something wrong", [
        { message: "Failed to delete slot please try again" },
      ]);
    }
  };

  const cancelSlot = async (id: string) => {
    try {
      const response: IAxiosResponse = await cancelBooking(id);
      if (response.data) {
        successToast("Cancelled", "Slot cancellation successful");
        setSlots((prev) => prev.filter((slot) => slot.id !== id));
      } else {
        errorTost(
          "Something went wrong",
          response.error.data.error || [
            { message: "Something went wrong please try again" },
          ]
        );
      }
    } catch (error) {
      console.error("Error cancelling slot:", error);
      errorTost("Something wrong", [
        { message: "Failed to cancel slot please try again" },
      ]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h3 className="font-semibold text-lg">{formatDate(slot.date)}</h3>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              slot.status
            )}`}
          >
            {slot.status === "available" && (
              <CheckCircle size={12} className="inline mr-1" />
            )}
            {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg w-fit">
            <Calendar size={14} />
            <p className="text-zinc-600 text-sm">
              {slot.startTime} -{" "}
              {calculateEndTime(slot.startTime, slot.duration)} (
              {formatDuration(slot.duration)})
            </p>
          </div>

          {slot.description ? (
            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
              {slot.description}
            </p>
          ) : (
            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
              No description provided for this slot.
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  slot.isBooked
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {slot.isBooked ? "Booked" : "Available"}
              </span>
            </div>
          </div>
        </div>

        {shouldShowDeleteButton() && (
          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
            {shouldShowCancelButton() ? (
              <button
                onClick={() => cancelSlot(slot.id as string)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {cancelBookingIsLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <>
                    <X size={16} />
                    Cancel Booking
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => deleteSlot(slot.id as string)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {deleteSlotIsLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
