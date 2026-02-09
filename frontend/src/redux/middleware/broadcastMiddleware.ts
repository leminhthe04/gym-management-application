import { type Middleware } from "@reduxjs/toolkit";

const channel = new BroadcastChannel("kiosk_channel");

export const broadcastMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    if (action.meta && action.meta.received) {
      return next(action);
    }

    if (action.type.startsWith("kiosk/")) {
      channel.postMessage(action);
    }

    return next(action);
  };

export const initBroadcastListener = (store: any) => {
    channel.onmessage = (event: MessageEvent) => {
        const action = event.data;

        store.dispatch({
            ...action,
            meta: { ...action.meta, received: true },
        });
    };
};
