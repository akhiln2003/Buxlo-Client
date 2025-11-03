import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { IBooking } from "@/@types/interface/IBookings";
import { PaymentStatus } from "@/@types/paymentEnum";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { PageNation } from "@/components/ui/pageNation";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { useGetUser } from "@/hooks/useGetUser";
import {
  useCancelBookingMutation,
  useFetchBookingsMutation,
} from "@/services/apis/CommonApis";
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Receipt,
  User,
  Hash,
  CreditCard,
  RefreshCw,
  UserCheck,
  Filter,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import BookingCancelConfirmationModal from "../components/BookingCancelConfirmationModal";

const ListBookings = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [pageNationData, setPageNationData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "all">(
    "all"
  );
  const [fetchBookings, { isLoading }] = useFetchBookingsMutation();
  const [cancelBooking] = useCancelBookingMutation();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<
    string | null
  >(null);

  const user = useGetUser();
  const userId = user?.id;

  const fetchBookedMentors = async (
    page: number = 1,
    status: PaymentStatus | "all" = "all"
  ) => {
    try {
      if (!userId) return;
      const response: IAxiosResponse = await fetchBookings({
        userId,
        page,
        status,
      });

      if (response.data) {
        setBookings(response.data.bookings);
        setPageNationData({
          pageNum: page,
          totalPages: response.data.totalPages,
        });
      } else {
        console.error("Error fetching bookings:", response.error);
        errorTost("Booking Load Failed", [
          { message: response.error.data?.error || "Please try again later" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  const handlePageChange = useCallback(
    async (page: number) => {
      if (!userId) return;
      await fetchBookedMentors(page, selectedStatus);
    },
    [userId, selectedStatus]
  );

  const handleStatusChange = useCallback(
    async (status: PaymentStatus | "all") => {
      setSelectedStatus(status);
      if (!userId) return;
      await fetchBookedMentors(1, status);
    },
    [userId]
  );

  const handleOpenCancelModal = (bookingId: string) => {
    setSelectedBookingForCancel(bookingId);
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBookingForCancel(null);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response: IAxiosResponse = await cancelBooking(bookingId);

      if (response.data) {
        successToast("Cancel Booking", "Booking cancellation successful");
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId
              ? { ...b, status: "cancelled" as PaymentStatus }
              : b
          )
        );
        handleCloseCancelModal();
      } else {
        console.error("Error fetching bookings:", response.error);
        errorTost("Booking Load Failed", [
          { message: response.error.data?.error || "Please try again later" },
        ]);
      }
    } catch (error) {
      console.error("Error cancel bookings:", error);
      errorTost("Cancellation Failed", [
        { message: "Failed to cancel booking. Please try again." },
      ]);
    } finally {
      setCancellingId(null);
    }
  };

  const isWithin24Hours = (transactionDate: Date): boolean => {
    const now = new Date();
    const bookingTime = new Date(transactionDate);
    const differenceInMs = now.getTime() - bookingTime.getTime();
    const differenceInHours = differenceInMs / (1000 * 60 * 60);
    return differenceInHours < 24;
  };

  useEffect(() => {
    if (userId) {
      fetchBookedMentors(1, selectedStatus);
    }
  }, [userId]);

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          bgColor: "bg-emerald-50 border-emerald-200",
          textColor: "text-emerald-700",
          iconColor: "text-emerald-600",
          badgeColor: "bg-emerald-100 text-emerald-700",
        };
      case "pending":
        return {
          icon: <Clock className="w-5 h-5" />,
          bgColor: "bg-amber-50 border-amber-200",
          textColor: "text-amber-700",
          iconColor: "text-amber-600",
          badgeColor: "bg-amber-100 text-amber-700",
        };
      case "booked":
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          bgColor: "bg-blue-50 border-blue-200",
          textColor: "text-blue-700",
          iconColor: "text-blue-600",
          badgeColor: "bg-blue-100 text-blue-700",
        };
      case "failed":
      case "cancelled":
        return {
          icon: <XCircle className="w-5 h-5" />,
          bgColor: "bg-red-50 border-red-200",
          textColor: "text-red-700",
          iconColor: "text-red-600",
          badgeColor: "bg-red-100 text-red-700",
        };
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgColor: "bg-gray-50 border-gray-200",
          textColor: "text-gray-700",
          iconColor: "text-gray-600",
          badgeColor: "bg-gray-100 text-gray-700",
        };
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading Header */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>

          {/* Loading Filters */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100">
            <div className="h-10 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
          </div>

          {/* Loading Cards */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-gray-100 rounded-xl"></div>
                  <div className="h-16 bg-gray-100 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
              <p className="text-gray-500 mt-1">
                Complete history of your mentor sessions
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-full border border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                {bookings.length} booking
                {bookings.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm flex justify-end">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) =>
                handleStatusChange(e.target.value as PaymentStatus | "all")
              }
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="booked">Booked</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              You haven't made any mentor bookings yet with this status. Try
              selecting a different filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const bookingDate = formatDate(booking.transactionDate as Date);
              const updatedDate = booking.updatedAt
                ? formatDate(booking.updatedAt as Date)
                : null;
              const canCancel =
                booking.status.toLowerCase() === "booked" &&
                isWithin24Hours(booking.transactionDate as Date);

              return (
                <div
                  key={booking.id}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${statusConfig.bgColor}`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-xl ${statusConfig.badgeColor}`}
                        >
                          <div className={statusConfig.iconColor}>
                            {statusConfig.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Booking Session
                          </h3>
                          <p className="text-sm text-gray-600">
                            ID: {booking.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.badgeColor}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>

                        {booking.status.toLowerCase() === "booked" && (
                          <Link
                            to={`${UserUrls.mentorProfile}/${booking.mentorId}`}
                            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition-colors group"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              View Profile
                            </span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* Left Side - Session Details */}
                      <div className="bg-white/70 rounded-xl p-4 border border-white/50">
                        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                          <Hash className="w-4 h-4 mr-2 text-gray-600" />
                          Session Details
                        </h4>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Mentor ID:
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                              {booking.mentorId.slice(-8)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Slot ID:
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                              {booking.slotId.slice(-8)}
                            </span>
                          </div>

                          {booking.paymentId && (
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center space-x-2">
                                <CreditCard className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  Payment ID:
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                {booking.paymentId.slice(0, 8)}...
                              </span>
                            </div>
                          )}

                          {updatedDate && (
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center space-x-2">
                                <RefreshCw className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  Last Updated:
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                {updatedDate.date}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side - Amount & Date */}
                      <div className="flex flex-col justify-between space-y-4">
                        {/* Amount */}
                        <div className="bg-white/70 rounded-xl p-4 border border-white/50">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Session Amount
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {formatAmount(booking.amount)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="bg-white/70 rounded-xl p-4 border border-white/50">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Booking Date
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                {bookingDate.date}
                              </p>
                              <p className="text-sm text-gray-500">
                                {bookingDate.time}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Cancel Button - 24 Hour Addon */}
                        {canCancel && (
                          <button
                            onClick={() => handleOpenCancelModal(booking.id)}
                            className="flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-3 rounded-xl transition-all duration-200 border border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm">Cancel Booking</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="w-full h-14 py-2 flex justify-center pr-[2rem] mt-2">
          <PageNation
            pageNationData={pageNationData}
            fetchUserData={handlePageChange}
            setpageNationData={setPageNationData}
          />
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <BookingCancelConfirmationModal
        isOpen={showCancelModal}
        bookingId={selectedBookingForCancel as string}
        isLoading={cancellingId === selectedBookingForCancel}
        onConfirm={handleCancelBooking}
        onCancel={handleCloseCancelModal}
      />
    </div>
  );
};

export default ListBookings;
