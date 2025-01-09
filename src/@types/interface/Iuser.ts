



export class Iuser {
  constructor(
    public name: string,
    public email: string,
    public role?: string,
    public isGoogle?: boolean,
    public id?: string,
    public avatar?: string,
  ) {}
}
