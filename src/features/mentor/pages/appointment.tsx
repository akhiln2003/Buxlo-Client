import React, { useEffect, useState, useCallback } from "react";
import { Plus, Calendar } from "lucide-react";
import { TabNavigation } from "../components/TabNavigation";
import { RecurringAvailabilityForm } from "../components/RecurringAvailabilityForm";
import { SlotCard } from "../components/SlotCard";
import { recurringFormSchema } from "../zodeSchema/RecurringFormSchema";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { useGetUser } from "@/hooks/useGetUser";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import {
  useCreateOneSlotMutation,
  useCreateRecurringSlotMutation,
  useFetchSlotsMutation,
} from "@/services/apis/MentorApis";
import { OneTimeSlotForm } from "../components/OneTimeSlotForm";
import { PageNation } from "@/components/ui/pageNation";
import SearchInput from "@/components/ui/searchInput";

export interface Slot {
  id?: string;
  mentorId: string;
  date: string;
  startTime: string;
  duration: number;
  salary: number;
  isBooked: boolean;
  description?: string;
  recurringDays?: string[];
  status: "available" | "booked" | "upcoming";
}

export interface AvailabilityRule {
  mentorId: string;
  days: string[];
  startTime: string;
  duration: number;
  startDate: string;
  salary: number;
  endDate: string;
  description?: string;
}

export interface IoneTimeSlotForm {
  date: string;
  startTime: string;
  duration: number;
  salary: number;
  description?: string;
}

export interface IrecurringForm {
  days: string[];
  startTime: string;
  duration: number;
  startDate: string;
  endDate: string;
  salary: number;
  description?: string;
}

export interface DurationOption {
  value: number;
  label: string;
}

export interface DayOfWeek {
  label: string;
  value: string;
}

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

const durationOptions: DurationOption[] = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 75, label: "1 hour 15 minutes" },
  { value: 90, label: "1 hour 30 minutes" },
];

const getTodaysDate = (): string => new Date().toISOString().split("T")[0];

const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + duration;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  return `${endHours.toString().padStart(2, "0")}:${endMins
    .toString()
    .padStart(2, "0")}`;
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0
    ? `${hours}h`
    : `${hours}h ${remainingMinutes}min`;
};

// Main Appointment Component
const Appointment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("manage");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const user = useGetUser();
  const [createOneSlot, { isLoading: createOneSlotLoading }] =
    useCreateOneSlotMutation();
  const [createRecurringSlot, { isLoading: createRecurringSlotLoading }] =
    useCreateRecurringSlotMutation();
  const [fetchSlots] = useFetchSlotsMutation();
  const [slots, setSlots] = useState<Slot[] | []>([]);
  const [pageNationData, setPageNationData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [oneTimeSlot, setOneTimeSlot] = useState<IoneTimeSlotForm>({
    date: "",
    startTime: "",
    duration: 60,
    salary: 0,
    description: "",
  });
  const [recurringForm, setRecurringForm] = useState<IrecurringForm>({
    days: [],
    startTime: "",
    duration: 60,
    startDate: "",
    endDate: "",
    salary: 0,
    description: "",
  });

  const addOneTimeSlot = async () => {
    try {
      const newSlot: Slot = {
        mentorId: user?.id as string,
        date: oneTimeSlot.date,
        startTime: oneTimeSlot.startTime,
        isBooked: false,
        duration: oneTimeSlot.duration,
        salary: oneTimeSlot.salary,
        status: "available",
      };
      if (oneTimeSlot.duration) newSlot.description = oneTimeSlot.description;
      const response: IAxiosResponse = await createOneSlot(newSlot);

      if (response.data) {
        const newSlot = response.data.newSlot;
        setSlots((prev) => [...prev, newSlot]);
        setOneTimeSlot({
          date: "",
          startTime: "",
          duration: 60,
          salary: 0,
          description: "",
        });
        successToast("Created", "One-time slot created successfully");
        // Refresh the slots list
        fetchDatas(pageNationData.pageNum, searchQuery);
      } else {
        errorTost(
          "Something went wrong ",
          response.error.data.error || [
            { message: "Something went wrong please try again" },
          ]
        );
      }
    } catch (error) {
      console.error("Error creating one-time slot:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  const addRecurringRule = async () => {
    const result = recurringFormSchema.safeParse(recurringForm);
    if (!result.success) {
      errorTost("Something wrong", [
        { message: "Please fill in all required fields" },
      ]);
      return;
    }

    const newRule: AvailabilityRule = {
      mentorId: user?.id as string,
      days: recurringForm.days,
      startTime: recurringForm.startTime,
      duration: recurringForm.duration,
      salary: recurringForm.salary,
      startDate: recurringForm.startDate,
      endDate: recurringForm.endDate,
    };
    if (recurringForm.description)
      newRule.description = recurringForm.description;

    try {
      const response: IAxiosResponse = await createRecurringSlot(newRule);
      if (response.data) {
        const newSlot = response.data.newSlot;
        if (newSlot.length) {
          setSlots((prev) => [...prev, ...newSlot]);
          setRecurringForm({
            days: [],
            startTime: "",
            duration: 60,
            startDate: "",
            endDate: "",
            salary: 0,
            description: "",
          });
          successToast("Created", "Recurring rule created successfully");
          // Refresh the slots list
          fetchDatas(pageNationData.pageNum, searchQuery);
        } else {
          setRecurringForm({
            days: [],
            startTime: "",
            duration: 60,
            startDate: "",
            endDate: "",
            salary: 0,
            description: "",
          });
          errorTost("Conflict", [
            { message: "Some slots were not created due to conflicts" },
          ]);
        }
      } else {
        errorTost(
          "Something went wrong ",
          response.error.data.error || [
            { message: "Something went wrong please try again" },
          ]
        );
      }
    } catch (error) {
      console.error("Error creating one-time slot:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  // Fetch slots data with pagination and search
  const fetchDatas = useCallback(
    async (page: number = 1, searchData: string = "") => {
      try {
        setLoading(true);
        const response: IAxiosResponse = await fetchSlots({
          mentorId: user?.id,
          page,
          searchData,
        });

        if (response.data) {
          setSlots(response.data.slots || []);
          setPageNationData({
            pageNum: page,
            totalPages: response.data.totalPages || 0,
          });
        } else {
          errorTost(
            "Something went wrong ",
            response.error?.data?.error || [
              { message: "Something went wrong please try again" },
            ]
          );
          setSlots([]);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        errorTost("Something wrong", [
          { message: "Something went wrong please try again" },
        ]);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchSlots, user?.id]
  );

  // Handle pagination
  const handlePageChange = useCallback(
    async (page: number) => {
      await fetchDatas(page, searchQuery);
    },
    [fetchDatas, searchQuery]
  );

  // Handle search with debouncing (handled by SearchInput component)
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setPageNationData((prev) => ({ ...prev, pageNum: 1 }));
  }, []);

  // Effect to fetch data when search query changes
  useEffect(() => {
    if (searchQuery !== undefined && user?.id) {
      fetchDatas(1, searchQuery);
    }
  }, [searchQuery, fetchDatas, user?.id]);

  // Initial data fetch
  useEffect(() => {
    if (user?.id) {
      fetchDatas(1, "");
    }
  }, [user?.id, fetchDatas]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Appointment Management
          </h1>
          <p className="text-gray-600">
            Manage your availability and appointment slots
          </p>
        </div>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "manage" && (
          <div className="space-y-8">
            <OneTimeSlotForm
              oneTimeSlot={oneTimeSlot}
              setOneTimeSlot={setOneTimeSlot}
              addOneTimeSlot={addOneTimeSlot}
              calculateEndTime={calculateEndTime}
              durationOptions={durationOptions}
              getTodaysDate={getTodaysDate}
              timeSlots={timeSlots}
              createOneSlotLoading={createOneSlotLoading}
            />
            <RecurringAvailabilityForm
              recurringForm={recurringForm}
              setRecurringForm={setRecurringForm}
              addRecurringRule={addRecurringRule}
              calculateEndTime={calculateEndTime}
              durationOptions={durationOptions}
              getTodaysDate={getTodaysDate}
              timeSlots={timeSlots}
              createRecurringSlotLoading={createRecurringSlotLoading}
            />
          </div>
        )}

        {activeTab === "slots" && (
          <div>
            {/* Search Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">My Slots</h2>
              <div className="w-full sm:w-80">
                <SearchInput
                  onSearch={handleSearch}
                  debounceDelay={400}
                  placeholder="Search slots by date, time, or description..."
                  className=""
                />
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Slots Grid */}
            {!loading && slots.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-500 mb-2">
                  {searchQuery ? "No slots found" : "No slots available"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Create your first appointment slot to get started"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setActiveTab("manage")}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Plus size={20} />
                    Add Your First Slot
                  </button>
                )}
              </div>
            ) : (
              !loading && (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Total slots: {slots.length}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {slots.map((slot) => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        setSlots={setSlots}
                        calculateEndTime={calculateEndTime}
                        formatDuration={formatDuration}
                      />
                    ))}
                  </div>
                </>
              )
            )}

            {/* Pagination */}
            {!loading && slots.length > 0 && pageNationData.totalPages > 1 && (
              <div className="w-full h-14 py-2 flex justify-center pr-[2rem] mt-6">
                <PageNation
                  pageNationData={pageNationData}
                  fetchUserData={handlePageChange}
                  setpageNationData={setPageNationData}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
