import { Trash2 } from "lucide-react";
import { AvailabilityRule } from "../pages/appointment";

// AvailabilityRulesList Component
interface AvailabilityRulesListProps {
  availabilityRules: AvailabilityRule[];
  deleteRule: (id: string) => void;
  formatDuration: (duration: number) => string;
  calculateEndTime: (startTime: string, duration: number) => string;
}

export const AvailabilityRulesList = ({
  availabilityRules,
  deleteRule,
  formatDuration,
  calculateEndTime,
}: AvailabilityRulesListProps) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-6">
      Existing Availability Rules
    </h2>

    {availabilityRules.length === 0 ? (
      <p className="text-gray-500 text-sm">No recurring rules set.</p>
    ) : (
      <div className="space-y-4">
        {availabilityRules.map((rule) => (
          <div
            key={rule.mentorId}
            className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm text-gray-600">
                    {rule.startTime} -{" "}
                    {calculateEndTime(rule.startTime, rule.duration)}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {formatDuration(rule.duration)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Days:</strong> {rule.days.join(", ")}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Period:</strong>{" "}
                  {new Date(rule.startDate).toLocaleDateString()} -{" "}
                  {new Date(rule.endDate).toLocaleDateString()}
                </div>
                {rule.description && (
                  <div className="text-sm text-gray-600">
                    <strong>Description:</strong> {rule.description}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteRule(rule.mentorId)}
                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
