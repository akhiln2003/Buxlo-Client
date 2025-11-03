import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Tag,
  Hash,
  ArrowLeft,
  Receipt,
  Calendar,
  CheckCircle,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { paymentFormSchema } from "@/components/zodeSchema/AddPaymentHistoryFormSchema";
import { IPaymentHistoryStatus } from "@/@types/IPaymentStatus";
import { IPaymentType } from "@/@types/IPaymentType";

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface PaymentManualEntryFormProps {
  onSubmit: (data: PaymentFormData) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

const PaymentHistoryManualEntryForm: React.FC<PaymentManualEntryFormProps> = ({
  onSubmit,
  onBack,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: 0,
      status: IPaymentHistoryStatus.PENDING,
      type: IPaymentType.CREDIT,
      paymentId: "",
      category: "",
      transactionDate: new Date().toISOString().slice(0, 16),
    },
  });

  const watchedAmount = watch("amount");
  const watchedType = watch("type");

  const statusOptions = [
    {
      value: IPaymentHistoryStatus.COMPLETED,
      label: "Completed",
      color: "text-green-600",
      description: "Payment has been booked",
    },
    {
      value: IPaymentHistoryStatus.PENDING,
      label: "Pending",
      color: "text-amber-600",
      description: "Payment is being processed",
    },
    {
      value: IPaymentHistoryStatus.FAILD,
      label: "Failed",
      color: "text-red-600",
      description: "Payment failed to process",
    },
  ];

  const paymentTypeOptions = [
    {
      value: IPaymentType.CREDIT,
      label: "Credit",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Money received",
    },
    {
      value: IPaymentType.DEBIT,
      label: "Debit",
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Money spent",
    },
  ];

  const selectedTypeOption = paymentTypeOptions.find(
    (option) => option.value === watchedType
  );
  const SelectedTypeIcon = selectedTypeOption?.icon || CreditCard;

  return (
    <div className="p-6 sm:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Add Single Payment
        </h3>
        <p className="text-gray-600 text-base">
          Enter payment details manually with all required information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Primary Information Section */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
            <Receipt size={18} className="text-blue-600" />
            Payment Information
          </h4>

          {/* First Row: Amount and Payment ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Amount Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Amount *
              </label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl">
                  <span className="text-gray-600 font-semibold text-base">
                    ₹
                  </span>
                </div>
                <input
                  {...register("amount", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={`w-full pl-14 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base font-medium ${
                    errors.amount
                      ? "border-red-300 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500 bg-white"
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.amount.message}
                </p>
              )}
              {watchedAmount > 0 && (
                <p className="text-green-600 text-sm mt-2 bg-green-50 px-3 py-2 rounded-lg">
                  Formatted:
                  <span className="font-semibold">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(watchedAmount)}
                  </span>
                </p>
              )}
            </div>

            {/* Payment ID Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <Hash size={14} className="inline mr-1" />
                Payment ID *
              </label>
              <input
                {...register("paymentId")}
                type="text"
                placeholder="e.g., PAY-2024-001"
                className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base h-[52px] ${
                  errors.paymentId
                    ? "border-red-300 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.paymentId && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.paymentId.message}
                </p>
              )}
            </div>
          </div>

          {/* Second Row: Transaction Date and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Transaction Date Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <Calendar size={14} className="inline mr-1" />
                Transaction Date *
              </label>
              <input
                {...register("transactionDate")}
                type="datetime-local"
                className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base h-[52px] ${
                  errors.transactionDate
                    ? "border-red-300 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.transactionDate && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.transactionDate.message}
                </p>
              )}
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <Tag size={14} className="inline mr-1" />
                Category *
              </label>
              <input
                {...register("category")}
                placeholder="e.g., Salary, Freelance"
                className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base h-[52px] ${
                  errors.category
                    ? "border-red-300 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.category && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Third Row: Payment Type Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <CreditCard size={14} className="inline mr-1" />
              Payment Type *
            </label>
            <div className="relative">
              <select
                {...register("type")}
                className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base appearance-none bg-white h-[52px] ${
                  errors.type
                    ? "border-red-300 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              >
                <option value="">Select payment type</option>
                {paymentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <SelectedTypeIcon
                  size={18}
                  className={selectedTypeOption?.color || "text-gray-400"}
                />
              </div>
            </div>
            {errors.type && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span>
                {errors.type.message}
              </p>
            )}
            {watchedType && (
              <div
                className={`mt-2 p-3 rounded-lg ${
                  selectedTypeOption?.bgColor
                } border ${
                  watchedType === IPaymentType.CREDIT
                    ? "border-green-200"
                    : "border-red-200"
                }`}
              >
                <p
                  className={`text-sm font-medium ${selectedTypeOption?.color} flex items-center gap-2`}
                >
                  <SelectedTypeIcon size={16} />
                  {selectedTypeOption?.label}: {selectedTypeOption?.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Selection Section */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
            <CheckCircle size={18} className="text-green-600" />
            Payment Status *
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statusOptions.map((status) => (
              <label
                key={status.value}
                className={`relative flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                  watchedAmount ? "hover:scale-105" : ""
                } group`}
              >
                <input
                  {...register("status")}
                  type="radio"
                  value={status.value}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-semibold text-xs sm:text-sm mb-1 ${status.color}`}
                  >
                    {status.label}
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed hidden sm:block">
                    {status.description}
                  </div>
                </div>
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 transition-colors"></div>
              </label>
            ))}
          </div>

          {errors.status && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <span>⚠️</span>
                {errors.status.message}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 font-medium text-gray-700 h-[52px] order-2 sm:order-1"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to Options</span>
            <span className="sm:hidden">Back</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center justify-center gap-2 px-4 sm:px-8 py-3.5 text-white rounded-xl transition-all flex-1 sm:flex-none font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 h-[52px] order-1 sm:order-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Creating Payment...</span>
                <span className="sm:hidden">Creating...</span>
              </>
            ) : (
              <>
                <Plus size={18} />
                <span className="hidden sm:inline">Create Payment</span>
                <span className="sm:hidden">Create</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentHistoryManualEntryForm;
