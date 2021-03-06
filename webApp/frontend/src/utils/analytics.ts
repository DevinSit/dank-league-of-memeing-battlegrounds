import {GA_TRACKING_ID, IS_PRODUCTION} from "config";

declare global {
    interface Window {
        gtag: (type: "config" | "event", action: string, params: Record<string, any>) => void;
    }
}

export const configUsername = (username: string) => {
    try {
        if (_canAnalytics()) {
            window.gtag("config", GA_TRACKING_ID!, {user_id: username});
        }
    } catch (e) {
        console.error(e);
    }
};

export const logEvent = (action: string, params: Record<string, any> = {}) => {
    try {
        if (_canAnalytics()) {
            window.gtag("event", action, params);
        }
    } catch (e) {
        console.error(e);
    }
};

const _canAnalytics = () =>
    IS_PRODUCTION &&
    GA_TRACKING_ID &&
    typeof window !== "undefined" &&
    typeof window.gtag !== "undefined";
