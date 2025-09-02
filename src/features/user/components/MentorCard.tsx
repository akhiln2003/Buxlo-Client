import { NotebookPen } from "lucide-react";

const MentorCard = () => {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        <NotebookPen className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
        <h2 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Mentors
        </h2>
      </div>
      <div className="border-t border-zinc-100 dark:border-zinc-600 pt-4">
        <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
          No mentors available
        </p>
      </div>
    </div>
  );
};


export default MentorCard