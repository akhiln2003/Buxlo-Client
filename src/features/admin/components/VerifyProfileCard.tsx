import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, CheckCircle, XCircle } from "lucide-react";
import { IMentor } from "@/@types/interface/IMentor";

interface ProfileCardProps {
  profile: IMentor;
  onViewDetails: (profile: IMentor) => void;
}

export const VerifyProfileCard = ({
  profile,
  onViewDetails,
}: ProfileCardProps) => (
  <Card className="bg-white dark:bg-zinc-800 hover:shadow-lg transition-shadow relative">
    <CardContent className="p-6">
      <div className="absolute top-4 right-4">
        {profile.verified === "verified" ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            {profile.verified}
          </span>
        )}
      </div>

      <div className="flex flex-col h-full pt-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 truncate">
              {profile.aadhaarName ? profile.aadhaarName : profile.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400 break-all">
              Aadhaar:{" "}
              {profile.aadhaarNumber ? profile.aadhaarNumber : "XXX XXX XXX"}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-auto pt-4">
          {profile.verified === "verificationPending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(profile)}
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);
