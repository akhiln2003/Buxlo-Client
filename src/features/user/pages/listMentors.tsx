import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MentorListSideBar } from "../components/MentorListSide";
import { MentorListCard } from "../components/MentorListCard";
import { useFetchMentorsListMutation } from "@/services/apis/UserApis";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import { IMentor } from "@/@types/interface/IMentor";
import { PageNation } from "@/components/ui/pageNation";
import SearchInput from "@/components/ui/searchInput";
import { Menu } from "lucide-react";

interface FilterState {
  experience: string;
  rating: string;
  salary: string;
  timestamp: number;
}

const INITIAL_FILTERS: FilterState = {
  experience: "",
  rating: "",
  salary: "",
  timestamp: Date.now(),
};

const FILTER_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY = "mentorFilters";

const ListMentors = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNationData, setPageNationData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [tempFilters, setTempFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [fetchMentors] = useFetchMentorsListMutation();

  // Load filters from localStorage on component mount
  const loadFiltersFromStorage = useCallback(() => {
    try {
      const savedFilters = localStorage.getItem(STORAGE_KEY);
      if (savedFilters) {
        const parsedFilters: FilterState = JSON.parse(savedFilters);
        const currentTime = Date.now();

        // Check if filters are still valid (not expired)
        if (currentTime - parsedFilters.timestamp < FILTER_EXPIRY_TIME) {
          setFilters(parsedFilters);
          setTempFilters(parsedFilters);
          return parsedFilters;
        } else {
          // Clear expired filters
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Error parsing saved filters:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return INITIAL_FILTERS;
  }, []);

  // Save filters to localStorage
  const saveFiltersToStorage = useCallback((filtersToSave: FilterState) => {
    try {
      if (
        filtersToSave.experience ||
        filtersToSave.rating ||
        filtersToSave.salary
      ) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtersToSave));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error saving filters to localStorage:", error);
    }
  }, []);

  // Fetch mentors data
  const fetchData = useCallback(
    async (
      page: number = 1,
      experience: string = "",
      rating: string = "",
      salary: string = "",
      searchData: string = ""
    ) => {
      try {
        setLoading(true);
        const response: IAxiosResponse = await fetchMentors({
          page,
          experience,
          rating,
          salary,
          searchData,
        });

        if (response.data) {
          // Extract only required fields
          const filteredMentors = response.data.datas.map(
            (mentor: IMentor) => ({
              id: mentor.id,
              name: mentor.name,
              email: mentor.email,
              avatar: mentor.avatar,
              bio: mentor.bio,
              expertise: mentor.expertise,
              yearsOfExperience: mentor.yearsOfExperience,
            })
          );

          setMentors(filteredMentors);
          setPageNationData((prev) => ({
            ...prev,
            totalPages: response.data.totalPages,
            pageNum: page,
          }));
        } else {
          const errorMessage = response.error?.data?.error || [
            {
              message: `${
                response.error?.data || "Unknown error"
              } please try again later`,
            },
          ];
          errorTost("Something went wrong", errorMessage);
          setMentors([]);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
        errorTost("Something went wrong", [
          { message: "Something went wrong please try again" },
        ]);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchMentors]
  );

  // Initialize filters and fetch data on mount
  useEffect(() => {
    const loadedFilters = loadFiltersFromStorage();

    // Fetch data with loaded filters
    fetchData(
      1,
      loadedFilters.experience,
      loadedFilters.rating,
      loadedFilters.salary,
      searchQuery
    );
  }, [loadFiltersFromStorage, fetchData, searchQuery]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setTempFilters((prev) => ({
      ...prev,
      ...newFilters,
      timestamp: Date.now(),
    }));
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    const updatedFilters = {
      ...tempFilters,
      timestamp: Date.now(),
    };

    setFilters(updatedFilters);
    saveFiltersToStorage(updatedFilters);

    // Reset to page 1 when filters change
    setPageNationData((prev) => ({ ...prev, pageNum: 1 }));

    // Fetch data with new filters
    fetchData(
      1,
      updatedFilters.experience,
      updatedFilters.rating,
      updatedFilters.salary,
      searchQuery
    );
  }, [tempFilters, saveFiltersToStorage, fetchData, searchQuery]);

  // Clear filters
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      ...INITIAL_FILTERS,
      timestamp: Date.now(),
    };

    setFilters(clearedFilters);
    setTempFilters(clearedFilters);
    localStorage.removeItem(STORAGE_KEY);

    // Reset to page 1 and fetch data without filters
    setPageNationData((prev) => ({ ...prev, pageNum: 1 }));
    fetchData(1, "", "", "", searchQuery);
  }, [fetchData, searchQuery]);

  // Check if filters have changed
  const hasFiltersChanged = useCallback(() => {
    return (
      filters.experience !== tempFilters.experience ||
      filters.rating !== tempFilters.rating ||
      filters.salary !== tempFilters.salary
    );
  }, [filters, tempFilters]);

  // Check if any filter is applied
  const hasFiltersApplied = useCallback(() => {
    return !!(
      tempFilters.experience ||
      tempFilters.rating ||
      tempFilters.salary
    );
  }, [tempFilters]);

  // Check if apply button should be enabled
  const isApplyButtonEnabled = useCallback(() => {
    return hasFiltersChanged() && hasFiltersApplied();
  }, [hasFiltersChanged, hasFiltersApplied]);

  // Handle pagination
  const handlePageChange = useCallback(
    async (page: number) => {
      await fetchData(
        page,
        filters.experience,
        filters.rating,
        filters.salary,
        searchQuery
      );
    },
    [fetchData, filters, searchQuery]
  );

  // Handle search with debouncing (handled by SearchInput component)
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setPageNationData((prev) => ({ ...prev, pageNum: 1 }));
  }, []);

  // Effect to fetch data when search query changes
  useEffect(() => {
    if (searchQuery !== undefined) {
      fetchData(
        1,
        filters.experience,
        filters.rating,
        filters.salary,
        searchQuery
      );
    }
  }, [searchQuery, fetchData, filters]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-zinc-900">
      {/* Sidebar */}
      <MentorListSideBar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        filters={tempFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onApplyFilters={applyFilters}
        isApplyButtonEnabled={isApplyButtonEnabled()}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 sm:p-6">
          {/* Header and search section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
            <div>
              <h1 className="text-xl font-bold">Chartered Accountants</h1>
              <p className="text-sm text-gray-500">
                Find the right CA for your financial needs.
              </p>
            </div>

            <div className="w-full lg:w-80 xl:w-96">
              <SearchInput
                onSearch={handleSearch}
                debounceDelay={400}
                className=""
              />
            </div>
          </div>

          {/* Filters button - mobile only */}
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

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Mentor Cards */}
          {!loading && (
            <div className="space-y-4">
              {mentors.length > 0 ? (
                mentors.map((mentor) => (
                  <MentorListCard
                    mentor={mentor}
                    availability="available"
                    rating={5}
                    key={mentor.id}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No mentors found matching your criteria.
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && mentors.length > 0 && (
            <div className="w-full h-14 py-2 flex justify-end pr-[2rem]">
              <PageNation
                pageNationData={pageNationData}
                fetchUserData={handlePageChange}
                setpageNationData={setPageNationData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListMentors;
