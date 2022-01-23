const BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || "5000";
const BACKEND_PROTOCOL = process.env.NEXT_PUBLIC_BACKEND_PROTOCOL || "http";

let BACKEND_URL = `${BACKEND_PROTOCOL}://${BACKEND_HOST}`;

if (BACKEND_PORT !== "80" && BACKEND_PORT !== "443") {
    BACKEND_URL = `${BACKEND_URL}:${BACKEND_PORT}`;
}

// Testing the BACKEND_URL for localhost is a good enough indicator of
// whether or not we're running in production or development
const IS_PRODUCTION = !BACKEND_URL.includes("localhost");

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export {BACKEND_URL, GA_TRACKING_ID, IS_PRODUCTION};
