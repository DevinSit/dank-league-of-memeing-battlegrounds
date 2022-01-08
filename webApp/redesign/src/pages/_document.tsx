import Document, {Html, Head, Main, NextScript} from "next/document";
import {AppNavigation} from "components/";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <meta name="description" content="Built by Devin Sit" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <body>
                    <Main />
                    <AppNavigation />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
