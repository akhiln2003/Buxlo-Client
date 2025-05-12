import { useEffect, useState } from "react";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MentorListSideBar } from "../components/MentorListSide";
import { MentorListCard } from "../components/MentorListCard";
import { useFetchMentorsListMutation } from "@/services/apis/UserApis";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import { Imentor } from "@/@types/interface/Imentor";

const ListMentors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mentors, setMentors] = useState<Imentor[] | []>([]);

  const [fetchMentors] = useFetchMentorsListMutation();

  const fetchData = async (
    availability: string = "all",
    page = 1,
    searchData = undefined
  ) => {
    try {
      const response: IaxiosResponse = await fetchMentors({
        page,
        availability,
        searchData,
      });
      

      if (response.data) {
        // Extracting only required fields
        const filteredMentors = response.data.datas.map((mentor: Imentor) => ({
          id: mentor.id,
          name: mentor.name,
          email: mentor.email,
          avatar: mentor.avatar,
          bio: mentor.bio,
          expertise: mentor.expertise,
          yearsOfExperience: mentor.yearsOfExperience,
        }));
        setMentors(filteredMentors);
      } else {
        errorTost(
          "Something went wrong ",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar - ONE instance for all screen sizes */}
      <MentorListSideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 sm:p-6">
          {/* Header and search section - now using flex layout that changes based on screen size */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
            {/* Title and description */}
            <div>
              <h1 className="text-xl font-bold">Chartered Accountants</h1>
              <p className="text-sm text-gray-500">
                Find the right CA for your financial needs.
              </p>
            </div>

            {/* Search bar - right aligned on large screens, full width below */}
            <div className="w-full lg:w-80 xl:w-96">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-4 py-2 rounded-l-md border-r-0 w-full"
                />
                <Button
                  variant="secondary"
                  className="rounded-l-none border border-l-0"
                >
                  <Search size={18} className="text-gray-600" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters button - only visible on screens below medium breakpoint */}
          <div className="mb-6 md:hidden">
            <Button
              variant="outline"
              className="w-full flex justify-center items-center gap-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={16} />
              <span>Filters</span>
            </Button>
          </div>

          {/* Mentor Cards */}
          <div className="space-y-4">
            {mentors.map((mentor) => (
              <MentorListCard
              mentor={mentor}
                availability={"available"}
                salary={111111}
                rating={5}
                key={mentor.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListMentors;
