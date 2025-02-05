import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, CheckCircle, XCircle, Timer } from "lucide-react";

interface VerifyProfileHeaderProps {
  selectedOption: string;
  onOptionChange: (value: string) => void;
}

export const VerifyProfileHeader = ({
  selectedOption,
  onOptionChange,
}: VerifyProfileHeaderProps) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-14">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-zinc-100">
      Profile Verification
    </h1>

    <Select onValueChange={onOptionChange} value={selectedOption}>
      <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-zinc-800 shadow-sm">
        <SelectValue placeholder="Verification Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <User className="ml-0.5 w-4 h-4" />
              <span>All</span>
            </div>
          </SelectItem>
          <SelectItem value="verified">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Verified Profile</span>
            </div>
          </SelectItem>
          <SelectItem value="verificationPending">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-orange-500" />
              <span>VerificationPending</span>
            </div>
          </SelectItem>
          <SelectItem value="applicationPending">
            <div className="flex items-center gap-2">
              <XCircle className="ml-0.5 w-4 h-4 text-red-500" />
              <span>ApplicationPending</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);
