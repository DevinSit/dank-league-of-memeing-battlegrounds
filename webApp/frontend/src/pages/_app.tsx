import type {AppProps} from "next/app";
import Head from "next/head";
import Script from "next/script";
import {AppNavigation} from "components/";
import {GA_TRACKING_ID, IS_PRODUCTION} from "config";
import {GameProvider} from "hooks/";
import "styles/global.scss";

const MyApp = ({Component, pageProps}: AppProps) => (
    <>
        <Head>
            <meta name="description" content="Built by Devin Sit" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <GameProvider>
            <Component {...pageProps} />
            <AppNavigation />
        </GameProvider>

        {IS_PRODUCTION && (
            <>
                {/* Global site tag (gtag.js) - Google Analytics */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                    strategy="afterInteractive"
                />

                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){window.dataLayer.push(arguments);}
                        gtag("js", new Date());

                        gtag("config", "${GA_TRACKING_ID}");
                    `}
                </Script>
            </>
        )}
    </>
);

export default MyApp;
