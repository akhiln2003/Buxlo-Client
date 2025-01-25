export class Isubscription {
  constructor(
    public price: number,
    public type: string,
    public offer: number,
    public id?: string,
    public currentOffer?: number,
    public createdAt?: string,
    public updatedAt?: string
  ) {}
}
