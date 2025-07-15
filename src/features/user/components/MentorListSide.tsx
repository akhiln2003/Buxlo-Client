import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  X,
  Star,
  Briefcase,
  DollarSign,
  Award,
  Filter,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

interface FilterState {
  experience: string;
  rating: string;
  salary: string;
  timestamp: number;
}

interface MentorListSideBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isApplyButtonEnabled: boolean;
}

// Constants
const MIN_SALARY = 0;
const MAX_SALARY = 200;

export const MentorListSideBar = ({
  isOpen,
  setIsOpen,
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  isApplyButtonEnabled,
}: MentorListSideBarProps) => {
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Parse salary from comma-separated string with proper defaults
  const parseSalary = useCallback((salaryString: string) => {
    if (!salaryString) return { min: MIN_SALARY, max: MAX_SALARY };
    
    const parts = salaryString.split(',');
    if (parts.length !== 2) return { min: MIN_SALARY, max: MAX_SALARY };
    
    const min = parseInt(parts[0].trim());
    const max = parseInt(parts[1].trim());
    
    // Validate parsed values
    if (isNaN(min) || isNaN(max) || min < MIN_SALARY || max > MAX_SALARY || min > max) {
      return { min: MIN_SALARY, max: MAX_SALARY };
    }
    
    return { min, max };
  }, []);

  const { min: minSalary, max: maxSalary } = parseSalary(filters.salary);

  // Prevent scrolling on body when sidebar is open (mobile)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle salary slider drag start
  const handleMouseDown = useCallback((type: 'min' | 'max', e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
  }, []);

  // Handle salary slider drag move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const value = Math.round(
      MIN_SALARY + percentage * (MAX_SALARY - MIN_SALARY)
    );

    let newMin = minSalary;
    let newMax = maxSalary;

    if (isDragging === "min") {
      newMin = Math.min(value, maxSalary - 5);
    } else if (isDragging === "max") {
      newMax = Math.max(value, minSalary + 5);
    }

    // Ensure values stay within bounds
    newMin = Math.max(MIN_SALARY, newMin);
    newMax = Math.min(MAX_SALARY, newMax);

    // Update salary filter as comma-separated string
    const salaryString = `${newMin},${newMax}`;
    onFilterChange({ salary: salaryString });
  }, [isDragging, minSalary, maxSalary, onFilterChange]);

  // Handle salary slider drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Setup and cleanup drag event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Filter options
  const experienceOptions = [
    { label: "0-1 Years", value: "0-1" },
    { label: "1-5 Years", value: "1-5" },
    { label: "5-15 Years", value: "5-15" },
    { label: "15+ Years", value: "15+" },
  ];

  const ratingOptions = [
    { label: "5 Stars & Above", value: "5", stars: 5 },
    { label: "4 Stars & Above", value: "4", stars: 4 },
    { label: "3 Stars & Above", value: "3", stars: 3 },
  ];

  // Apply filters and close sidebar on mobile
  const applyFilters = useCallback(() => {
    onApplyFilters();
    
    // Close sidebar on mobile after applying filters
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [onApplyFilters, setIsOpen]);

  // Check if any filters are applied
  const hasFiltersApplied = useCallback(() => {
    return !!(filters.experience || filters.rating || filters.salary);
  }, [filters.experience, filters.rating, filters.salary]);

  // Clear filters and close sidebar on mobile
  const handleClearFilters = useCallback(() => {
    onClearFilters();
    
    // Close sidebar on mobile after clearing filters
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [onClearFilters, setIsOpen]);

  // Handle experience filter change
  const handleExperienceChange = useCallback((value: string) => {
    onFilterChange({ 
      experience: filters.experience === value ? "" : value 
    });
  }, [filters.experience, onFilterChange]);

  // Handle rating filter change
  const handleRatingChange = useCallback((value: string) => {
    onFilterChange({ 
      rating: filters.rating === value ? "" : value 
    });
  }, [filters.rating, onFilterChange]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`fixed md:relative top-0 bottom-0 right-0 w-80 md:w-72 bg-white dark:bg-zinc-800 z-50 transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"} 
          md:block md:static md:transform-none shadow-2xl md:shadow-lg border-l border-gray-200 dark:border-gray-700
          h-screen overflow-y-auto`}
      >
        <div className="p-6">
          {/* Mobile header with close button */}
          <div className="flex justify-between items-center mb-6 md:hidden">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Filters
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full p-2 h-9 w-9"
            >
              <X size={18} className="text-gray-600 dark:text-gray-300" />
            </Button>
          </div>

          {/* Header for desktop */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Filters
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              disabled={!hasFiltersApplied()}
              className="text-xs hover:bg-gray-50 dark:hover:bg-zinc-700 dark:border-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={14} className="mr-1" />
              Clear
            </Button>
          </div>

          {/* Experience section */}
          <div className="mb-6">
            <Collapsible
              className="w-full"
              open={experienceOpen}
              onOpenChange={setExperienceOpen}
            >
              <CollapsibleTrigger className="flex w-full justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-xl border-2 border-gray-100 dark:border-gray-700 transition-all duration-200">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Experience
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform text-gray-600 dark:text-gray-300 ${
                    experienceOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2">
                {experienceOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-3 p-3 text-sm cursor-pointer rounded-lg transition-all duration-200 ${
                      filters.experience === option.value
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-600"
                        : "hover:bg-gray-50 dark:hover:bg-zinc-700 border-2 border-transparent"
                    }`}
                    onClick={() => handleExperienceChange(option.value)}
                  >
                    <Briefcase
                      size={16}
                      className={
                        filters.experience === option.value
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      }
                    />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {option.label}
                    </span>
                    {filters.experience === option.value && (
                      <Badge
                        variant="secondary"
                        className="ml-auto bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Rating filter */}
          <div className="mb-6">
            <Collapsible
              className="w-full"
              open={ratingOpen}
              onOpenChange={setRatingOpen}
            >
              <CollapsibleTrigger className="flex w-full justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-xl border-2 border-gray-100 dark:border-gray-700 transition-all duration-200">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Rating
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform text-gray-600 dark:text-gray-300 ${
                    ratingOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2">
                {ratingOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center justify-between p-3 text-sm cursor-pointer rounded-lg transition-all duration-200 ${
                      filters.rating === option.value
                        ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-600"
                        : "hover:bg-gray-50 dark:hover:bg-zinc-700 border-2 border-transparent"
                    }`}
                    onClick={() => handleRatingChange(option.value)}
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {option.label}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < option.stars
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Salary filter */}
          <div className="mb-6">
            <Collapsible
              className="w-full"
              open={salaryOpen}
              onOpenChange={setSalaryOpen}
            >
              <CollapsibleTrigger className="flex w-full justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-xl border-2 border-gray-100 dark:border-gray-700 transition-all duration-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Salary Range
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform text-gray-600 dark:text-gray-300 ${
                    salaryOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 p-4 bg-gray-50 dark:bg-zinc-700 rounded-xl">
                <div className="space-y-4">
                  {/* Display current range */}
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Min
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-600"
                      >
                        ₹{minSalary}/hr
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Max
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-600"
                      >
                        ₹{maxSalary}/hr
                      </Badge>
                    </div>
                  </div>

                  {/* Custom range slider */}
                  <div className="relative h-6 flex items-center">
                    <div
                      ref={sliderRef}
                      className="relative w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer"
                    >
                      {/* Active range track */}
                      <div
                        className="absolute h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                        style={{
                          left: `${(minSalary / MAX_SALARY) * 100}%`,
                          width: `${
                            ((maxSalary - minSalary) / MAX_SALARY) * 100
                          }%`,
                        }}
                      />

                      {/* Min handle */}
                      <div
                        className="absolute w-5 h-5 bg-white border-2 border-green-500 rounded-full cursor-grab shadow-md hover:shadow-lg transition-shadow -top-1.5 transform -translate-x-1/2"
                        style={{ left: `${(minSalary / MAX_SALARY) * 100}%` }}
                        onMouseDown={(e) => handleMouseDown("min", e)}
                      >
                        <div className="absolute inset-1 bg-green-500 rounded-full" />
                      </div>

                      {/* Max handle */}
                      <div
                        className="absolute w-5 h-5 bg-white border-2 border-green-500 rounded-full cursor-grab shadow-md hover:shadow-lg transition-shadow -top-1.5 transform -translate-x-1/2"
                        style={{ left: `${(maxSalary / MAX_SALARY) * 100}%` }}
                        onMouseDown={(e) => handleMouseDown("max", e)}
                      >
                        <div className="absolute inset-1 bg-green-500 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Range labels */}
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>₹{MIN_SALARY}</span>
                    <span>₹{MAX_SALARY}+</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {/* Apply filters button */}
            <Button 
              className={`w-full font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 ${
                isApplyButtonEnabled 
                  ? "bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-900 hover:to-zinc-950 text-white hover:shadow-xl" 
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
              onClick={applyFilters}
              disabled={!isApplyButtonEnabled}
            >
              Apply Filters
            </Button>

            {/* Clear filters button - Mobile only */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              disabled={!hasFiltersApplied()}
              className="w-full md:hidden text-xs hover:bg-gray-50 dark:hover:bg-zinc-700 dark:border-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={14} className="mr-1" />
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};