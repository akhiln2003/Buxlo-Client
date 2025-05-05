export class Ichat {
  constructor(
    public participants: string[],
    public unreadCount: number,
    public type: "OneToOne" | "Group",
    public lastMessage?: string,
    public name?: string,
    public avatar?: string,
    public id?: string
  ) {}
}
