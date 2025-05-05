import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown , X } from "lucide-react";
import { useEffect, useState } from "react";


interface MentorListSideBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const MentorListSideBar = ({ isOpen, setIsOpen }: MentorListSideBarProps) => {
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [salaryOpen, setSalaryOpen] = useState(false);

  // Effect to prevent body scrolling when sidebar is open on mobile
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

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar content */}
      <div
        className={`fixed md:relative top-0 bottom-0 right-0 w-72 md:w-64 bg-white overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        } md:block md:static md:transform-none shadow-lg md:shadow-none`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100 rounded-full p-2 h-8 w-8"
            >
              <X size={20} />
            </Button>
          </div>

          <h3 className="text-sm font-medium mb-2">Sort by</h3>

          <Collapsible
            className="w-full border rounded-lg mb-2"
            open={experienceOpen}
            onOpenChange={setExperienceOpen}
          >
            <CollapsibleTrigger className="flex w-full justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
              <span>Experience</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  experienceOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-2">
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                Most Relevant
              </div>
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                Highest Rated
              </div>
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                Newest First
              </div>
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                Lowest Price
              </div>
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                Highest Price
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            className="w-full border rounded-lg mb-2"
            open={ratingOpen}
            onOpenChange={setRatingOpen}
          >
            <CollapsibleTrigger className="flex w-full justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
              <span>Rating</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  ratingOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-2">
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                5 Stars & Above
              </div>
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                4 Stars & Above
              </div>
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                3 Stars & Above
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            className="w-full border rounded-lg"
            open={salaryOpen}
            onOpenChange={setSalaryOpen}
          >
            <CollapsibleTrigger className="flex w-full justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
              <span>Salary</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  salaryOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-2">
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                Under $25/hr
              </div>
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                $25-$50/hr
              </div>
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                $50-$100/hr
              </div>
              <div className="p-2 text-sm hover:bg-gray-100 cursor-pointer rounded">
                $100+/hr
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </>
  );
};