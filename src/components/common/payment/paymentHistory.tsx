import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useFetchPaymentHistoryMutation } from "@/services/apis/CommonApis";
import { PageNation } from "@/components/ui/pageNation";
import SearchInput from "@/components/ui/searchInput";

import {
  Plus,
  XCircle,
  Clock,
  ChevronDown,
  Search,
  Receipt,
  Eye,
  Tag,
  Filter,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useGetUser } from "@/hooks/useGetUser";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { IPaymentHistory } from "@/@types/interface/IPaymentHistory";
import PaymentDetailsModal from "./paymentHistoryDetailsModal";
import AddPaymentModal from "./addPaymentHistoryModal";
import { IPaymentHistoryStatus } from "@/@types/IPaymentStatus";
import { IPaymentType } from "@/@types/IPaymentType";

const PaymentHistory = () => {
  const [fetchPayments, { isLoading: fetchPaymentsIsLoading }] =
    useFetchPaymentHistoryMutation();
  const [payments, setPayments] = useState<IPaymentHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageNationData, setPageNationData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState<
    IPaymentHistoryStatus | "all"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<IPaymentHistory | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const user = useGetUser();

  // Status options for dropdown
  const statusOptions = [
    { value: "all", label: "All Status", count: payments.length },
    {
      value: IPaymentHistoryStatus.COMPLETED,
      label: "Completed",
      count: payments.filter((p) => p.status === IPaymentHistoryStatus.COMPLETED)
        .length,
    },
    {
      value: IPaymentHistoryStatus.PENDING,
      label: "Pending",
      count: payments.filter((p) => p.status === IPaymentHistoryStatus.PENDING)
        .length,
    },
    {
      value: IPaymentHistoryStatus.FAILD,
      label: "Failed",
      count: payments.filter((p) => p.status === IPaymentHistoryStatus.FAILD)
        .length,
    },
   
  ];

  // Fetch payments data
  const fetchData = useCallback(
    async (
      page: number = 1,
      searchData: string = "",
      status: IPaymentHistoryStatus | "all" = "all"
    ) => {
      try {
        const response: IAxiosResponse = await fetchPayments({
          userId: user?.id as string,
          page,
          status,
          searchData,
        });

        if (response.data) {
          setPayments(response.data.datas);
          setPageNationData({
            pageNum: page,
            totalPages: response.data.totalPages,
          });
        } else {
          setPayments([]);
          setPageNationData({ pageNum: 1, totalPages: 0 });
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        setPayments([]);
        setPageNationData({ pageNum: 1, totalPages: 0 });
      }
    },
    [fetchPayments, user?.id]
  );

  // Initialize data on mount only
  useEffect(() => {
    if (user?.id) {
      fetchData(1, "", "all");
    }
  }, [fetchData, user?.id]);

  // Handle pagination
  const handlePageChange = useCallback(
    async (page: number) => {
      await fetchData(page, searchQuery, selectedStatus);
    },
    [fetchData, searchQuery, selectedStatus, selectedCategory]
  );

  // Handle search - triggers API call
  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setPageNationData((prev) => ({ ...prev, pageNum: 1 }));
      fetchData(1, value, selectedStatus);
    },
    [fetchData, selectedStatus, selectedCategory]
  );

  // Handle status filter - triggers API call
  const handleStatusFilter = useCallback(
    (status: IPaymentHistoryStatus | "all") => {
      setSelectedStatus(status);
      setShowStatusDropdown(false);
      setPageNationData((prev) => ({ ...prev, pageNum: 1 }));
      fetchData(1, searchQuery, status);
    },
    [fetchData, searchQuery, selectedCategory]
  );

  // Handle view payment details
  const handleViewPayment = (payment: IPaymentHistory) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Format date with proper error handling - simplified format
  const formatDate = (
    dateString: string | undefined,
    simple: boolean = false
  ) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      if (simple) {
        return new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "2-digit",
        }).format(date);
      }

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  // Truncate text with ellipsis
  const truncateText = (text: string, length: number = 12) => {
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  // Tooltip component for payment ID
  const PaymentIdTooltip = ({ paymentId }: { paymentId: string }) => {
    const [showTooltip, setShowTooltip] = useState(false);


    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="font-semibold text-gray-900 mb-1 truncate cursor-pointer hover:text-blue-600"
        >
          Payment #{truncateText(paymentId, 12)}
        </div>
        {showTooltip && (
          <div className="absolute left-0 bottom-full mb-2 bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50 shadow-lg">
            Payment #{paymentId}
            <div className="absolute top-full left-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        )}
      </div>
    );
  };

  // Get category color based on category name
 const getCategoryColor = (category?: string) => {
  const colors = [
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-orange-100 text-orange-700 border-orange-200",
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-indigo-100 text-indigo-700 border-indigo-200",
    "bg-yellow-100 text-yellow-700 border-yellow-200",
    "bg-cyan-100 text-cyan-700 border-cyan-200",
    "bg-red-100 text-red-700 border-red-200",
  ];

  if (!category || typeof category !== "string") {
    // Default color for missing category
    return "bg-gray-100 text-gray-700 border-gray-200";
  }

  const hash = category
    .split("")
    .reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);

  return colors[Math.abs(hash) % colors.length];
};


  // Get payment type display
  const getPaymentTypeDisplay = (type?: string) => {
    if (!type) {
      return {
        icon: CreditCard,
        color: "text-gray-600",
        bg: "bg-gray-100",
        text: "N/A",
      };
    }

    if (type.toLowerCase() === IPaymentType.CREDIT) {
      return {
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-100",
        text: "Credit",
      };
    }

    return {
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-100",
      text: "Debit",
    };
  };

  // Get status icon and color
  const getStatusDisplay = (status: IPaymentHistoryStatus) => {
    switch (status) {
      case IPaymentHistoryStatus.COMPLETED:
        return {
          icon: ShieldCheck,
          color: "text-blue-600",
          bg: "bg-blue-50 border-blue-200",
          text: "Completed",
        };
      case IPaymentHistoryStatus.PENDING:
        return {
          icon: Clock,
          color: "text-amber-600",
          bg: "bg-amber-50 border-amber-200",
          text: "Pending",
        };
      case IPaymentHistoryStatus.FAILD:
        return {
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-50 border-red-200",
          text: "Failed",
        };
      
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          bg: "bg-gray-50 border-gray-200",
          text: "Unknown",
        };
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
        <Receipt size={32} className="text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No payments found
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-8">
        {searchQuery || selectedStatus !== "all" || selectedCategory !== "all"
          ? "No payments match your current search criteria. Try adjusting your filters."
          : "You haven't made any payments yet. Your payment history will appear here once you start making transactions."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => setShowAddPayment(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Payment
        </Button>
        {(searchQuery ||
          selectedStatus !== "all" ||
          selectedCategory !== "all") && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedStatus("all");
              setSelectedCategory("all");
              fetchData(1, "", "all");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
        <div
          className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0"
          style={{
            borderTopColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "transparent",
          }}
        ></div>
      </div>
      <p className="text-gray-600 mt-4 font-medium">Loading payments...</p>
    </div>
  );

  const selectedStatusLabel =
    statusOptions.find((option) => option.value === selectedStatus)?.label ||
    "All Status";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Payment History
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage all your payment transactions across categories
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setShowAddPayment(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Payment
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
            {/* Search */}
            <div className="flex-1 min-w-0 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <SearchInput
                onSearch={handleSearch}
                debounceDelay={400}
                placeholder="Search by payment ID, category, or user ID..."
                className="w-full pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowStatusDropdown(!showStatusDropdown);
                  }}
                  className="flex items-center justify-between gap-3 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
                >
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedStatusLabel}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      showStatusDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showStatusDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleStatusFilter(
                            option.value as IPaymentHistoryStatus | "all"
                          )
                        }
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between ${
                          selectedStatus === option.value
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        } ${
                          option === statusOptions[0] ? "rounded-t-lg" : ""
                        } ${
                          option === statusOptions[statusOptions.length - 1]
                            ? "rounded-b-lg"
                            : ""
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        {option.count > 0 && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              selectedStatus === option.value
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {option.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              {(searchQuery ||
                selectedStatus !== "all" ||
                selectedCategory !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus("all");
                    setSelectedCategory("all");
                    fetchData(1, "", "all");
                  }}
                  className="px-4 py-2 text-sm whitespace-nowrap"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {fetchPaymentsIsLoading ? (
            <LoadingState />
          ) : payments.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="block lg:hidden divide-y divide-gray-200">
                {payments.map((payment) => {
                  const statusDisplay = getStatusDisplay(payment.status);
                  const StatusIcon = statusDisplay.icon;
                  const categoryColor = getCategoryColor(payment.category);
                  const paymentTypeDisplay = getPaymentTypeDisplay(
                    payment.type
                  );
                  const PaymentTypeIcon = paymentTypeDisplay.icon;

                  return (
                    <div key={payment.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryColor}`}
                            >
                              <Tag size={12} />
                              {payment.category}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentTypeDisplay.bg} ${paymentTypeDisplay.color}`}
                            >
                              <PaymentTypeIcon size={12} />
                              {paymentTypeDisplay.text}
                            </span>
                          </div>
                          <PaymentIdTooltip paymentId={payment.paymentId} />
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xl font-bold ${
                              payment.type?.toLowerCase() ===
                              IPaymentType.CREDIT
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {payment.type?.toLowerCase() === IPaymentType.CREDIT
                              ? "+"
                              : "-"}
                            {formatCurrency(Math.abs(payment.amount))}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(payment.transactionDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusDisplay.bg}`}
                        >
                          <StatusIcon
                            size={14}
                            className={statusDisplay.color}
                          />
                          <span
                            className={`text-sm font-medium ${statusDisplay.color}`}
                          >
                            {statusDisplay.text}
                          </span>
                        </div>

                        <Button
                          onClick={() => handleViewPayment(payment)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block">
                <div className="min-w-full overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                          Payment Details
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                          Date
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {payments.map((payment) => {
                        const statusDisplay = getStatusDisplay(payment.status);
                        const StatusIcon = statusDisplay.icon;
                        const categoryColor = getCategoryColor(
                          payment.category
                        );
                        const paymentTypeDisplay = getPaymentTypeDisplay(
                          payment.type
                        );
                        const PaymentTypeIcon = paymentTypeDisplay.icon;

                        return (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="min-w-0">
                                <PaymentIdTooltip paymentId={payment.paymentId} />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentTypeDisplay.bg} ${paymentTypeDisplay.color} whitespace-nowrap`}
                              >
                                <PaymentTypeIcon
                                  size={12}
                                  className="flex-shrink-0"
                                />
                                <span>{paymentTypeDisplay.text}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryColor} max-w-full`}
                              >
                                <Tag size={12} className="flex-shrink-0" />
                                <span className="truncate">
                                  {payment.category}
                                </span>
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className={`text-lg font-bold whitespace-nowrap ${
                                  payment.type?.toLowerCase() ===
                                  IPaymentType.CREDIT
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {payment.type?.toLowerCase() ===
                                IPaymentType.CREDIT
                                  ? "+"
                                  : "-"}
                                {formatCurrency(Math.abs(payment.amount))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusDisplay.bg} whitespace-nowrap`}
                              >
                                <StatusIcon
                                  size={14}
                                  className={`${statusDisplay.color} flex-shrink-0`}
                                />
                                <span
                                  className={`text-sm font-medium ${statusDisplay.color}`}
                                >
                                  {statusDisplay.text}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              <div className="text-sm whitespace-nowrap">
                                {formatDate(payment.transactionDate)}
                              </div>
                              {payment.updatedAt && (
                                <div className="text-xs text-gray-400 whitespace-nowrap">
                                  Updated: {formatDate(payment.updatedAt, true)}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Button
                                onClick={() => handleViewPayment(payment)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 flex items-center gap-1 mx-auto whitespace-nowrap"
                              >
                                <Eye size={14} />
                                View
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!fetchPaymentsIsLoading && payments.length > 0 && (
          <div className="w-full flex justify-center p-3">
            <PageNation
              pageNationData={pageNationData}
              fetchUserData={handlePageChange}
              setpageNationData={setPageNationData}
            />
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={showAddPayment}
        userId={user?.id as string}
        onClose={() => setShowAddPayment(false)}
        setPayments={setPayments}
      />

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        isOpen={showPaymentDetails}
        onClose={() => setShowPaymentDetails(false)}
        payment={selectedPayment}
      />

      {/* Click outside to close dropdowns */}
      {showStatusDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowStatusDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default PaymentHistory;