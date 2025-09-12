import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { IBooking } from "@/@types/interface/IBookings";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { errorTost } from "@/components/ui/tosastMessage";
import { useFetchBookingsMutation } from "@/services/apis/CommonApis";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface MentorCardProps {
  userId: string | undefined;
}

const MentorCard: React.FC<MentorCardProps> = ({ userId }) => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [pageNationData, setPageNationData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [fetchBookings, { isLoading }] = useFetchBookingsMutation();

  const fetchBookedMentors = async () => {
    try {
      if (!userId) return;
      const response: IAxiosResponse = await fetchBookings({
        userId,
        page: pageNationData.pageNum,
      });

      if (response.data) {
        setBookings(response.data.bookings);
        setPageNationData((prev) => ({
          ...prev,
          totalPages: response.data.totalPages,
        }));
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

  // const handlePageChange = useCallback(
  //   async (page: number) => {
  //     if (!userId) return;
  //     setPageNationData((prev) => ({ ...prev, pageNum: page }));
  //     const response: IAxiosResponse = await fetchBookings({
  //       userId,
  //       page,
  //     });

  //     if (response.data) {
  //       setBookings(response.data.bookings);
  //       setPageNationData((prev) => ({
  //         ...prev,
  //         totalPages: response.data.totalPages,
  //       }));
  //     }
  //   },
  //   [fetchBookings, userId]
  // );

  useEffect(() => {
    if (userId) {
      fetchBookedMentors();
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
          bgColor: "bg-blue-50 border-blue-200",
          textColor: "text-blue-700",
          iconColor: "text-blue-600",
          badgeColor: "bg-blue-100 text-blue-700",
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
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Receipt className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Bookings Found
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          You haven't made any mentor bookings yet. Start exploring our mentors
          to book your first session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
          <p className="text-gray-500 mt-1">Manage your mentor sessions</p>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-gray-700">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => {
          const statusConfig = getStatusConfig(booking.status);
          const bookingDate = formatDate(booking.transactionDate as Date);
          const updatedDate = booking.updatedAt
            ? formatDate(booking.updatedAt as Date)
            : null;

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

                    {/* ✅ Show link only if status is 'booked' */}
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
                  <div className="flex flex-col justify-center space-y-4">
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
                          <p className="text-sm text-gray-600">Booking Date</p>
                          <p className="text-lg font-bold text-gray-900">
                            {bookingDate.date}
                          </p>
                          <p className="text-sm text-gray-500">
                            {bookingDate.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        className="flex justify-center mt-8 text-blue-900  "
        to={UserUrls.listBookings}
        state={userId}
      >
        See all bookings...
      </Link>
    </div>
  );
};

export default MentorCard;
