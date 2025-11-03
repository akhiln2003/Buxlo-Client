import React, { useState, useCallback } from "react";
import {
  X,
  Plus,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
  ArrowLeft,
  Receipt,
  Edit,
} from "lucide-react";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import {
  useAddPaymetHistoryMutation,
  useUploadBankStatementMutation,
} from "@/services/apis/CommonApis";
import { IPaymentHistory } from "@/@types/interface/IPaymentHistory";
import PaymentHistoryManualEntryForm from "./PaymentHistoryManualEntryForm";
import { IPaymentHistoryStatus } from "@/@types/IPaymentStatus";

interface FileUploadState {
  file: File | null;
  preview: string | null;
  uploading: boolean;
  error: string | null;
}

type EntryMode = "selection" | "file-upload" | "manual-entry";

interface AddPaymentModalProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
  setPayments: React.Dispatch<React.SetStateAction<IPaymentHistory[]>>;
}

// Updated payment form data type without userId
interface PaymentFormData {
  amount: number;
  status: IPaymentHistoryStatus;
  paymentId: string;
  category: string;
  transactionDate?: string;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  userId,
  onClose,
  setPayments,
}) => {
  const [entryMode, setEntryMode] = useState<EntryMode>("selection");
  const [fileState, setFileState] = useState<FileUploadState>({
    file: null,
    preview: null,
    uploading: false,
    error: null,
  });
  const [dragActive, setDragActive] = useState(false);

  const [addPayment, { isLoading: addPaymentIsLoading }] =
    useAddPaymetHistoryMutation();
  const [uploadFile, { isLoading: fileUploadIsLoading }] =
    useUploadBankStatementMutation();

  // File validation - Only bank statement files
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a bank statement file (PDF, Excel, or CSV only)";
    }

    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const error = validateFile(file);

    if (error) {
      setFileState((prev) => ({ ...prev, error, file: null, preview: null }));
      return;
    }

    setFileState({
      file,
      preview: null,
      uploading: false,
      error: null,
    });
  }, []);

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  // Remove file
  const removeFile = useCallback(() => {
    setFileState({
      file: null,
      preview: null,
      uploading: false,
      error: null,
    });
  }, []);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return "📊";
    if (fileType.includes("csv")) return "📋";
    return "📎";
  };

  const handleFileSubmit = async () => {
  if (!fileState.file) return;

  try {
    const formData = new FormData();
    formData.append("bankStatement", fileState.file);

    const response: IAxiosResponse = await uploadFile({
      data: formData,
      userId: userId,
    });

    if (response.data) {
      
      // Update payments list with single payment
      // setPayments((prevPayments) => {
      //   if (prevPayments.length === 10) {
      //     return [response.data, ...prevPayments.slice(0, 9)];
      //   }
      //   return [response.data, ...prevPayments];
      // });
      removeFile();
      successToast("Success", "Bank statement uploaded successfully");
      onClose();
      window.location.reload();

    } else {
      removeFile();
      handleClose();
      errorTost(
        "Something went wrong",
        response.error.data.error || [
          { message: `${response.error.data} please try again later` },
        ]
      );
    }
  } catch (error) {
    console.error("Error uploading bank statement:", error);
    errorTost("Something wrong", [
      { message: "Something went wrong please try again" },
    ]);
  }
};

  const formatDateToBackend = (transactionDate: string) => {
    // Convert from datetime-local input format to database format
    const date = new Date(transactionDate);

    // Format: YYYY-MM-DD HH:MM:SS.ssssss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

    // Create the exact format your database expects: 2025-09-16 04:50:32.209000
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}000`;
  };

  // Handle adding new payment - updated to add userId here
  const handleManualSubmit = async (paymentData: PaymentFormData) => {
    try {
      if (paymentData.transactionDate) {
        paymentData.transactionDate = formatDateToBackend(
          paymentData.transactionDate
        );
      }

      const paymentDataWithUserId = {
        ...paymentData,
        userId,
      };

      const response: IAxiosResponse = await addPayment(paymentDataWithUserId);
      if (response.data) {
        setPayments((prevPayments) => {
          if (prevPayments.length === 9) {
            const updated = [...prevPayments];
            updated[0] = response.data;
            return updated;
          }
          return [response.data, ...prevPayments];
        });
        handleClose();
        successToast("Success", "successfully added new transaction history");
      } else {
        setEntryMode("selection");
        errorTost(
          "Something went wrong",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  const handleClose = () => {
    removeFile();
    setEntryMode("selection");
    onClose();
  };

  const handleBack = () => {
    if (entryMode === "file-upload") {
      removeFile();
    }
    setEntryMode("selection");
  };

  if (!isOpen) return null;

  // Selection Screen
  const renderSelectionScreen = () => (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
          Add New Payment
        </h3>
        <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
          Choose your preferred method to add payment information to your
          history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {/* Single Payment Option */}
        <div
          onClick={() => setEntryMode("manual-entry")}
          className="group cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 group-hover:bg-green-200 rounded-full sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-colors">
            <Receipt size={20} className="text-green-600 sm:w-8 sm:h-8" />
          </div>
          <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
            Single Payment
          </h4>
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
            Add one payment manually with complete control over all details and
            fields
          </p>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full">
            <Edit size={12} />
            Manual Entry
          </div>
        </div>

        {/* Bank Statement Upload Option */}
        <div
          onClick={() => setEntryMode("file-upload")}
          className="group cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 group-hover:bg-blue-200 rounded-full sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-colors">
            <Upload size={20} className="text-blue-600 sm:w-8 sm:h-8" />
          </div>
          <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
            Upload Bank Statement
          </h4>
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
            Upload your bank statement and automatically extract multiple
            payments
          </p>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full">
            <FileText size={12} />
            PDF, Excel, CSV
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          You can always add more payments later from your payment history
        </p>
      </div>
    </div>
  );

  // File Upload Screen
  const renderFileUploadScreen = () => (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
          Upload Bank Statement
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Upload your bank statement to extract payment information
          automatically
        </p>
      </div>

      {!fileState.file ? (
        <div
          className={`border-2 border-dashed rounded-xl p-6 sm:p-12 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : fileState.error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${
                fileState.error ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              {fileState.error ? (
                <AlertCircle
                  size={24}
                  className="text-red-600 sm:w-10 sm:h-10"
                />
              ) : (
                <Upload size={24} className="text-blue-600 sm:w-10 sm:h-10" />
              )}
            </div>

            <div className="w-full">
              <h4 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-3">
                Drop your bank statement here
              </h4>
              <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
                Or tap to browse and select your bank statement
              </p>

              <label className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-colors text-sm sm:text-lg font-medium">
                <Upload size={16} className="sm:w-5 sm:h-5" />
                Choose Bank Statement
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.xlsx,.xls,.csv"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </label>
            </div>

            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                <strong>Supported formats:</strong> PDF, Excel (XLSX/XLS), CSV
              </p>
              <p className="text-xs text-gray-400">Maximum file size: 10MB</p>
              <p className="text-xs text-gray-400 mt-2">
                Bank statements from any bank are supported
              </p>
            </div>
          </div>

          {fileState.error && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {fileState.error}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-start gap-3 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg bg-blue-100 flex items-center justify-center text-2xl sm:text-3xl">
                  {getFileIcon(fileState.file.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 truncate">
                  {fileState.file.name}
                </h4>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">
                  <span>{formatFileSize(fileState.file.size)}</span>
                  <span>•</span>
                  <span className="truncate">{fileState.file.type}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle
                    size={14}
                    className="text-green-600 sm:w-4 sm:h-4"
                  />
                  <span className="text-xs sm:text-sm text-green-600 font-medium">
                    Bank statement ready to process
                  </span>
                </div>
              </div>

              <div className="flex gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 sm:p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <Trash2 size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex gap-2 sm:gap-3">
              <FileText
                size={16}
                className="text-blue-600 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5"
              />
              <div>
                <h5 className="font-medium text-blue-900 mb-1 text-sm sm:text-base">
                  What happens next?
                </h5>
                <p className="text-xs sm:text-sm text-blue-700">
                  We'll process your bank statement and extract payment
                  transactions. You can review and edit before saving to your
                  payment history.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleBack}
          disabled={fileUploadIsLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        {fileState.file && (
          <button
            onClick={handleFileSubmit}
            disabled={fileUploadIsLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 px-6 py-2.5 text-white rounded-lg transition-colors flex-1 sm:flex-none text-sm font-medium"
          >
            {fileUploadIsLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <Upload size={16} />
                Process Bank Statement
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {entryMode !== "selection" && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={addPaymentIsLoading || fileUploadIsLoading}
              >
                <ArrowLeft size={16} className="text-gray-600 sm:w-5 sm:h-5" />
              </button>
            )}
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Plus size={16} className="text-blue-600 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {entryMode === "selection"
                  ? "Add Payment"
                  : entryMode === "file-upload"
                  ? "Upload Bank Statement"
                  : "Manual Entry"}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                {entryMode === "selection"
                  ? "Choose how to add your payment"
                  : entryMode === "file-upload"
                  ? "Upload and process your bank statement"
                  : "Enter payment details manually"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={addPaymentIsLoading || fileUploadIsLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={16} className="text-gray-400 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content based on mode */}
        {entryMode === "selection" && renderSelectionScreen()}
        {entryMode === "file-upload" && renderFileUploadScreen()}
        {entryMode === "manual-entry" && (
          <PaymentHistoryManualEntryForm
            onSubmit={handleManualSubmit}
            onBack={handleBack}
            isLoading={addPaymentIsLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AddPaymentModal;
