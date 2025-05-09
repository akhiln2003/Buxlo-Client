import { useState } from "react";
import { Calendar, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterDropdownProps {
  filterType: "day" | "month" | "year" | "";
  setFilterType: (type: "day" | "month" | "year" | "") => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

export function FilterSection({
  filterType,
  setFilterType,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Create a local state for active tab to manage UI independently
  const [activeTab, setActiveTab] = useState<"day" | "month" | "year">("day");

  // Generate options for months
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  // Generate options for years (current year and past 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYear - i).toString());

  const handleFilterTypeChange = (type: "day" | "month" | "year") => {
    setActiveTab(type); // Update the UI tab
    
    // Only update the actual filter type when applying filters
    // This prevents premature filter changes
  };

  const clearAllFilters = () => {
    setFilterType("");
    setSelectedYear("");
    setSelectedMonth("");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters = filterType !== "" || 
    selectedYear !== "" || 
    selectedMonth !== "" || 
    startDate !== "" || 
    endDate !== "";

  const applyFilters = () => {
    // Apply the active tab as filter type when user clicks "Apply"
    setFilterType(activeTab);
    setIsOpen(false);
  };

  return (
    <div className="relative ml-auto">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant={hasActiveFilters ? "default" : "outline"} 
            size="sm" 
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            <span>
              {hasActiveFilters ? "Filters Applied" : "Apply Filters"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => handleFilterTypeChange(value as "day" | "month" | "year")}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="day">Date Range</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>

              <TabsContent value="day" className="space-y-4 mt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-9 pl-10 pr-3 border rounded-md text-sm"
                      onClick={(e) => e.stopPropagation()} // Prevent closing on click
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-9 pl-10 pr-3 border rounded-md text-sm"
                      onClick={(e) => e.stopPropagation()} // Prevent closing on click
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="month" className="space-y-4 mt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Month</label>
                  <Select 
                    value={selectedMonth} 
                    onValueChange={setSelectedMonth} 
                    onOpenChange={(open) => {
                      // Prevent propagation when Select is opened or closed
                      if (!open) {
                        setTimeout(() => setIsOpen(true), 0);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem 
                          key={month.value} 
                          value={month.value}
                          onClick={(e) => e.stopPropagation()} // Prevent closing on click
                        >
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Year</label>
                  <Select 
                    value={selectedYear} 
                    onValueChange={setSelectedYear}
                    onOpenChange={(open) => {
                      // Prevent propagation when Select is opened or closed
                      if (!open) {
                        setTimeout(() => setIsOpen(true), 0);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem 
                          key={year} 
                          value={year}
                          onClick={(e) => e.stopPropagation()} // Prevent closing on click
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="year" className="space-y-4 mt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Year</label>
                  <Select 
                    value={selectedYear} 
                    onValueChange={setSelectedYear}
                    onOpenChange={(open) => {
                      // Prevent propagation when Select is opened or closed
                      if (!open) {
                        setTimeout(() => setIsOpen(true), 0);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem 
                          key={year} 
                          value={year}
                          onClick={(e) => e.stopPropagation()} // Prevent closing on click
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedYear && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Year: {selectedYear}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent closing on click
                        setSelectedYear("");
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {selectedMonth && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Month: {months.find(m => m.value === selectedMonth)?.label}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent closing on click
                        setSelectedMonth("");
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {startDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    From: {startDate}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent closing on click
                        setStartDate("");
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {endDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    To: {endDate}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent closing on click
                        setEndDate("");
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 border-t">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent closing on click
                  clearAllFilters();
                }}
                className="text-red-500"
              >
                Clear filters
              </Button>
            )}
            <Button
              size="sm"
              className="ml-auto"
              onClick={applyFilters}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}