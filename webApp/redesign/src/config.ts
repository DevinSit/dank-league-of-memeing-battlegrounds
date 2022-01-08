const BACKEND_HOST = process.env.BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.BACKEND_PORT || "5000";
const BACKEND_PROTOCOL = process.env.BACKEND_PROTOCOL || "http";

let BACKEND_URL = `${BACKEND_PROTOCOL}://${BACKEND_HOST}`;

if (BACKEND_PORT !== "80" && BACKEND_PORT !== "443") {
    BACKEND_URL = `${BACKEND_URL}:${BACKEND_PORT}`;
}

// Testing the BACKEND_URL for localhost is a good enough indicator of
// whether or not we're running in production or development
const IS_PRODUCTION = !BACKEND_URL.includes("localhost");

export {BACKEND_URL, IS_PRODUCTION};
