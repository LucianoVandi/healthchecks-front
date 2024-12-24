import "../styles/globals.css";
import { TranslationProvider } from "../context/TranslationContext";

function MyApp({ Component, pageProps }) {
    return (
        <TranslationProvider>
            <Component {...pageProps} />
        </TranslationProvider>
    )
}

export default MyApp;
