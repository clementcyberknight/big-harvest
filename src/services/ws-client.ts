import { BACKEND_WS_URL } from "@/config/backend";

let activeSocket: WebSocket | null = null;

export function connectGameSocket(accessToken: string): WebSocket {
  if (activeSocket) {
    activeSocket.close();
    activeSocket = null;
  }

  const socket = new WebSocket(`${BACKEND_WS_URL}/?token=${accessToken}`);
  activeSocket = socket;

  socket.onclose = () => {
    if (activeSocket === socket) {
      activeSocket = null;
    }
  };

  return socket;
}

export function getGameSocket(): WebSocket | null {
  return activeSocket;
}

export function disconnectGameSocket() {
  if (activeSocket) {
    activeSocket.close();
    activeSocket = null;
  }
}

export function sendGameSocketMessage(payload: unknown) {
  if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) {
    return;
  }

  activeSocket.send(JSON.stringify(payload));
}
