import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
  onSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  className = "",
  debounceDelay = 500,
  onSearch,
}) => {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [value, debounceDelay]);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 dark:border-gray-800 text-sm dark:bg-zinc-900 focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-700"
      />
      <Search
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-500 pointer-events-none"
      />
    </div>
  );
};

export default SearchInput;
