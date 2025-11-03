import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  XCircle,
  Clock,
  Calendar,
  Receipt,
  Tag,
  CreditCard,
  User,
  Hash,
  Copy,
  CheckCheck,
} from "lucide-react";
import { IPaymentHistory } from "@/@types/interface/IPaymentHistory";
import { IPaymentHistoryStatus } from "@/@types/IPaymentStatus";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: IPaymentHistory | null;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  payment,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPaymentIdTooltip, setShowPaymentIdTooltip] = useState(false);

  // Copy to clipboard function
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
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

  // Get category color based on category name
  const getCategoryColor = (category: string) => {
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

    const hash = category.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  // Truncate text with ellipsis
  const truncateText = (text: string, length: number = 12) => {
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  // Get status icon and color
  const getStatusDisplay = (status: IPaymentHistoryStatus) => {
    switch (status) {
      case IPaymentHistoryStatus.COMPLETED:
        return {
          icon: Calendar,
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

  if (!isOpen || !payment) return null;

  const statusDisplay = getStatusDisplay(payment.status);
  const StatusIcon = statusDisplay.icon;
  const categoryColor = getCategoryColor(payment.category);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Receipt size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Payment Details
              </h2>
              <p className="text-gray-600">
                Complete information for payment #{payment.paymentId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Payment Information */}
            <div className="space-y-6">
              {/* Payment Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-600" />
                  Payment Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusDisplay.bg}`}
                    >
                      <StatusIcon size={16} className={statusDisplay.color} />
                      <span className={`font-medium ${statusDisplay.color}`}>
                        {statusDisplay.text}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Category</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${categoryColor}`}
                    >
                      <Tag size={14} />
                      {payment.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Hash size={20} className="text-gray-600" />
                  Transaction Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between group">
                    <span className="text-gray-600">Payment ID</span>
                    <div className="flex items-center gap-2 relative">
                      <div
                        onMouseEnter={() => setShowPaymentIdTooltip(true)}
                        onMouseLeave={() => setShowPaymentIdTooltip(false)}
                        className="relative"
                      >
                        <span className="font-mono text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 hover:underline max-w-xs truncate">
                          {truncateText(payment.paymentId, 12)}
                        </span>
                        {showPaymentIdTooltip && (
                          <div className="absolute right-0 bottom-full mb-2 bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50 shadow-lg">
                            {payment.paymentId}
                            <div className="absolute bottom-0 right-3 w-2 h-2 bg-gray-900 transform rotate-45 translate-y-1"></div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(payment.paymentId, "paymentId")
                        }
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                      >
                        {copiedField === "paymentId" ? (
                          <CheckCheck size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Date</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(payment.transactionDate)}
                    </span>
                  </div>
                  {payment.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(payment.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Additional Information */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-gray-600" />
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between group">
                    <span className="text-gray-600">User ID</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {payment.userId || "N/A"}
                      </span>
                      {payment.userId && (
                        <button
                          onClick={() =>
                            copyToClipboard(payment.userId, "userId")
                          }
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                        >
                          {copiedField === "userId" ? (
                            <CheckCheck size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} className="text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Statistics */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Receipt size={20} className="text-green-600" />
                  Payment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900">
                      Credit Card
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time</span>
                    <span className="font-medium text-gray-900">Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium text-gray-900">INR</span>
                  </div>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(payment, null, 2),
                        "fullData"
                      )
                    }
                  >
                    <Copy size={16} className="mr-2" />
                    {copiedField === "fullData"
                      ? "Copied!"
                      : "Copy Payment Data"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none px-6"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;