export interface User {
  id: string;
  name: string;
}

export interface Message {
  sender: string;
  message: string;
  type: "sent" | "received";
}

export interface NewMessage {
  sender: {
    id: string;
    name: string;
  };
  content: string;
}
