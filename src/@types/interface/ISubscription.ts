export class ISubscription {
  constructor(
    public price: number,
    public type: string,
    public offer: number,
    public duration: number, // Duration in days
    public id?: string,
    public currentOffer?: number,
    public createdAt?: string,
    public updatedAt?: string
  ) {}
}

// Helper function to calculate premium end date
export const calculatePremiumEndDate = (duration: number): Date => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + duration);
  return endDate;
};

// Helper to get duration from plan type (for backward compatibility)
export const getDurationFromType = (type: string): number => {
  const typeLower = type.toLowerCase();
  
  if (typeLower === 'day') return 1;
  if (typeLower === 'week') return 7;
  if (typeLower === 'month') return 30;
  if (typeLower === 'quarter') return 90;
  if (typeLower === 'year') return 365;
  if (typeLower === 'lifetime') return 36500; // 100 years
  
  return 30; // default to 1 month
};