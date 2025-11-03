import { AlertCircle, Trash2, X } from "lucide-react";

interface CancelConfirmationModalProps {
  isOpen: boolean;
  bookingId: string;
  isLoading: boolean;
  onConfirm: (bookingId: string) => void;
  onCancel: () => void;
}

const BookingCancelConfirmationModal: React.FC<
  CancelConfirmationModalProps
> = ({ isOpen, bookingId, isLoading, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-red-50 border-b border-red-100 px-6 py-6 flex items-start space-x-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Cancel Booking?
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              This action cannot be undone.
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            Are you sure you want to cancel this booking? If you cancel within
            24 hours of booking, you may be subject to cancellation fees as per
            the platform policy.
          </p>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 flex items-start space-x-2">
              <span className="mt-0.5">•</span>
              <span>Booking ID: {bookingId?.slice(0, 8)}...</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-100">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Keep Booking
          </button>
          <button
            onClick={() => onConfirm(bookingId)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Cancelling...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Cancel Booking</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCancelConfirmationModal;
