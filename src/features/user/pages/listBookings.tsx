import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { IBooking } from "@/@types/interface/IBookings";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { PageNation } from "@/components/ui/pageNation";
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
  Filter,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

const ListBookings = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<IBooking[]>([]);
  const [pageNationData, setPageNationData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fetchBookings, { isLoading }] = useFetchBookingsMutation();

  const location = useLocation();
  const userId = location.state;

  const fetchBookedMentors = async (page: number = 1) => {
    try {
      if (!userId) return;
      const response: IAxiosResponse = await fetchBookings({
        userId,
        page,
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
      await fetchBookedMentors(page);
    },
    [userId]
  );

  useEffect(() => {
    if (userId) {
      fetchBookedMentors();
    }
  }, [userId]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = bookings;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (booking) =>
          booking.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Search functionality
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.mentorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.slotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (booking.paymentId &&
            booking.paymentId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, selectedStatus, searchTerm]);

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

  const getUniqueStatuses = () => {
    const statuses = bookings.map((booking) => booking.status.toLowerCase());
    return [...new Set(statuses)];
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
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="h-10 bg-gray-200 rounded-xl flex-1 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
            </div>
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
                {filteredBookings.length} of {bookings.length} booking
                {bookings.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by booking ID, mentor ID, slot ID, or payment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                {getUniqueStatuses().map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {(searchTerm || selectedStatus !== "all") && (
          <div className="mb-6 text-sm text-gray-600">
            {filteredBookings.length > 0 ? (
              <p>
                Showing {filteredBookings.length} result
                {filteredBookings.length !== 1 ? "s" : ""}
                {searchTerm && ` for "${searchTerm}"`}
                {selectedStatus !== "all" && ` with status "${selectedStatus}"`}
              </p>
            ) : (
              <p>
                No results found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedStatus !== "all" && ` with status "${selectedStatus}"`}
              </p>
            )}
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {bookings.length === 0 ? "No Bookings Found" : "No Results Found"}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {bookings.length === 0
                ? "You haven't made any mentor bookings yet. Start exploring our mentors to book your first session."
                : "Try adjusting your search criteria or filters to find what you're looking for."}
            </p>
            {(searchTerm || selectedStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
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
    </div>
  );
};

export default ListBookings;
