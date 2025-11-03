import { PaymentStatus } from "../paymentEnum";

export class IPayment {
  constructor(
    public amount: number,
    public mentorId: string,
    public userId: string,
    public slotId: string, 
    public status: PaymentStatus,
    public paymentId: string,
    public id?: string,
    public transactionDate?: string,
    public updatedAt?: string,
  ) {}
}
