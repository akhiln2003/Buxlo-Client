import { IPaymentHistoryStatus } from "../IPaymentStatus";
import { IPaymentType } from "../IPaymentType";

export class IPaymentHistory {
  constructor(
    public amount: number,
    public userId: string,
    public status: IPaymentHistoryStatus,
    public type : IPaymentType,
    public paymentId: string,
    public id: string,
    public category: string,
    public transactionDate?: string,
    public updatedAt?: string
  ) {}
}
