export class IUser {
  constructor(
    public name: string,
    public email: string,
    public role?: string,
    public isGoogle?: boolean,
    public id?: string,
    public avatar?: string,
    public premiumId?: boolean,
    public premiumEndDate?: string
  ) {}
}
