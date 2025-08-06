
// Tab Navigation Component
interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TabNavigation = ({ activeTab, setActiveTab }:TabNavigationProps) => (
  <div className="mb-6">
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {['manage', 'slots'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab === 'manage' ? 'Manage Availability' : 'My Slots'}
          </button>
        ))}
      </nav>
    </div>
  </div>
);