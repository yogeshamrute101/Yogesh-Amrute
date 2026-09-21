export type CommunicationMessage = {
  channel: "user" | "system" | "service" | "device";
  message: string;
  timestamp: number;
};

export class CommunicationLayer {
  private messages: CommunicationMessage[] = [];

  send(message: CommunicationMessage) {
    this.messages.push(message);
    return message;
  }

  history() {
    return [...this.messages];
  }
}
