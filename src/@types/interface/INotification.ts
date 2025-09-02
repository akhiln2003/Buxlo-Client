export class INotification {
  constructor(
    public recipient: string,
    public type: "update" | "warning" | "error" | "success" | "message",
    public message: string,
    public status: "unread" | "read",
    public updatedAt?: string,
    public createdAt?: string,
    public id?: string
  ) {}
}
