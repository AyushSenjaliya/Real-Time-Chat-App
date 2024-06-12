// custom-socket.d.ts
import { Socket as IoSocket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    user?: {
      sub: number;
      email: string;
    };
  }
}
