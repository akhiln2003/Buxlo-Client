import { InewMessage } from "@/pages/chat";

export class IChat {
  constructor(
    public participants: string[],
    public unreadCount: number,
    public type: "OneToOne" | "Group",
    public lastMessage?: InewMessage,
    public name?: string,
    public avatar?: string,
    public id?: string
  ) {}
}
