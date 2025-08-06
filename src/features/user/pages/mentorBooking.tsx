import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { errorTost } from "@/components/ui/tosastMessage";
import { Imentor } from "@/@types/interface/Imentor";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import {
  useFetchMentorProfileImageMutation,
  useFetchMentorProfileMutation,
  useFetchSlotsMutation,
} from "@/services/apis/MentorApis";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import { useCreateCheckoutSessionMutation } from "@/services/apis/CommonApis";

export interface Slot {
  mentorId: string;
  date: string;
  startTime: string;
  duration: number;
  isBooked: boolean;
  description?: string;
  recurringDays?: string[];
  status: "available" | "booked" | "upcoming";
  id?: string;
}

const MentorBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [findSlots] = useFetchSlotsMutation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookingStep, setBookingStep] = useState("calendar");
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState<Partial<Imentor>>({});
  const [fetchProfileData] = useFetchMentorProfileMutation();
  const [fetchProfileImages] = useFetchMentorProfileImageMutation();
  const [createChecKoutSession] = useCreateCheckoutSessionMutation();

  // Fetch mentor data
  const fetchMentor = async (id: string) => {
    try {
      const response: IaxiosResponse = await fetchProfileData(id);

      if (response.data.data) {
        const mentorData = { ...response.data.data };

        if (mentorData.avatar) {
          const imageUrl: IaxiosResponse = await fetchProfileImages([
            `MentorProfiles/${mentorData.avatar}`,
          ]);

          if (imageUrl.data.imageUrl) {
            mentorData.avatar = imageUrl.data.imageUrl[0];
          }
        }

        setMentor(mentorData);
      }
    } catch (err) {
      console.error("Error fetching mentor:", err);
      errorTost("Error", [
        { message: "Something went wrong fetching mentor info." },
      ]);
    }
  };

  const fetchSlots = async () => {
    try {
      const response: IaxiosResponse = await findSlots(mentor.id);
      if (response.data) {
        setSlots(response.data.slots);
      } else {
        errorTost(
          "Error fetching slots",
          response.error?.data?.error || [
            { message: "Please try again later." },
          ]
        );
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
      errorTost("Error", [{ message: "Something went wrong." }]);
    }
  };

  useEffect(() => {
    fetchMentor(mentorId as string);
  }, [mentorId]);

  useEffect(() => {
    if (mentor.id) fetchSlots();
  }, [mentor.id]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false;
    const dateStr = formatDate(date);
    return slots.some((slot) => slot.date === dateStr && !slot.isBooked);
  };

  const getAvailableSlots = (date: Date) => {
    const dateStr = formatDate(date);
    return slots
      .filter((slot) => slot.date === dateStr && !slot.isBooked)
      .map((slot) => ({
        id: slot.id,
        time: slot.startTime,
        duration: slot.duration,
      }));
  };

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setBookingStep("slots");
      setSelectedSlot(null);
    }
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setBookingStep("confirm");
  };

  const handleBooking = async () => {
    try {
      console.log("Booking details:", {
        amount: mentor.salary || 100,
        mentorName: mentor.name || "Akhil",
        slotId: selectedSlot.id,
      });

      const response: IaxiosResponse = await createChecKoutSession({
        amount: mentor.salary || (100 as number),
        mentorName: mentor.name || ("akhil" as string),
        slotId: selectedSlot.id as string,
      });
      console.log("Booking response:", response.data);
      if (response.data) {
        const sessionId = response.data.sessionId;
        window.location.href = sessionId;
      } else {
        errorTost("Error", [
          { message: response.error?.data?.error || "Booking failed." },
        ]);
      }
    } catch (error) {
      console.error("Error during booking:", error);
      errorTost("Error", [{ message: "Something went wrong while booking." }]);
    }
    setBookingStep("calendar");
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const goBack = () => {
    if (bookingStep === "slots") {
      setBookingStep("calendar");
      setSelectedDate(null);
    } else if (bookingStep === "confirm") {
      setBookingStep("slots");
      setSelectedSlot(null);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <img
              src={mentor.avatar || dummyProfileImage}
              alt={`${mentor.name}'s profile`}
              className="w-24 h-24 rounded-2xl object-cover shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-black mb-2">
                {mentor.name}
              </h1>
              <p className="text-xl text-gray-600 mb-3">
                {mentor.expertise || "Expert in various fields"}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                  <span className="font-semibold">{mentor.rating || 4.8}</span>
                </div>
                {/* find and show averate salary */}
                {/* <div className="bg-black text-white px-4 py-2 rounded-full font-bold">
                  {mentor.salary || "₹0/hr"}
                </div> */}
              </div>
            </div>
            {bookingStep !== "calendar" && (
              <button
                onClick={goBack}
                className="flex items-center bg-gray-100 hover:bg-gray-200 text-black px-6 py-3 rounded-xl font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
            )}
          </div>
        </div>

        {/* Calendar */}
        {bookingStep === "calendar" && (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Select a Date</h2>
                  <p className="text-gray-300">
                    Choose your preferred session date
                  </p>
                </div>
                <div className="flex items-center bg-white/10 rounded-2xl p-2">
                  <button
                    onClick={prevMonth}
                    className="p-3 hover:bg-white/20 rounded-xl"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <span className="text-xl font-bold px-6 min-w-[200px] text-center">
                    {monthNames[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-3 hover:bg-white/20 rounded-xl"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-7 gap-4 mb-6">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-gray-500 font-bold py-4 text-sm"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-4">
                {getDaysInMonth(currentMonth).map((date, index) => (
                  <div key={index} className="aspect-square">
                    {date && (
                      <button
                        onClick={() => handleDateSelect(date)}
                        disabled={!isDateAvailable(date)}
                        className={`w-full h-full rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                          isDateAvailable(date)
                            ? "bg-black text-white hover:bg-gray-800 cursor-pointer shadow-lg"
                            : "bg-gray-100 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slots */}
        {bookingStep === "slots" && selectedDate && (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8">
              <h2 className="text-3xl font-bold mb-2">Choose Your Time</h2>
              <p className="text-gray-300">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getAvailableSlots(selectedDate).map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  className="group p-6 border-2 border-gray-200 rounded-2xl hover:border-black hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 group-hover:bg-black rounded-xl flex items-center justify-center mb-3">
                      <Clock className="w-6 h-6 text-gray-600 group-hover:text-white" />
                    </div>
                    <span className="font-bold text-xl text-black">
                      {slot.time}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      {slot.duration} min
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirm */}
        {bookingStep === "confirm" && selectedSlot && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Almost There!</h2>
                <p className="text-gray-300">Review your booking details</p>
              </div>
              <div className="p-8">
                <div className="space-y-6 mb-8">
                  <div className="p-4 bg-gray-50 rounded-2xl flex justify-between">
                    <User className="w-6 h-6 mr-2 text-gray-600" />
                    <span className="font-bold text-black">{mentor.name}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl flex justify-between">
                    <Calendar className="w-6 h-6 mr-2 text-gray-600" />
                    <span className="font-bold text-black">
                      {selectedDate?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl flex justify-between">
                    <Clock className="w-6 h-6 mr-2 text-gray-600" />
                    <span className="font-bold text-black">
                      {selectedSlot.time}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleBooking}
                  className="w-full bg-black text-white py-6 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-105"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorBooking;
