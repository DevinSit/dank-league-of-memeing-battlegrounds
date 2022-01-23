import {GA_TRACKING_ID, IS_PRODUCTION} from "config";

declare global {
    interface Window {
        gtag: (type: "config" | "event", action: string, params: Record<string, any>) => void;
    }
}

export const configUsername = (username: string) => {
    if (IS_PRODUCTION && GA_TRACKING_ID && typeof window !== "undefined") {
        window.gtag("config", GA_TRACKING_ID, {user_id: username});
    }
};

export const logEvent = (action: string, params: Record<string, any> = {}) => {
    if (IS_PRODUCTION && GA_TRACKING_ID && typeof window !== "undefined") {
        window.gtag("event", action, params);
    }
};
