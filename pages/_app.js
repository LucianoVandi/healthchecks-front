import "../styles/globals.css";
import { TranslationProvider } from "../context/TranslationContext";

function MyApp({ Component, pageProps }) {
    const { locale = 'en'} = pageProps;

    return (
        <TranslationProvider locale={locale}>
            <Component {...pageProps} />
        </TranslationProvider>
    )
}

export default MyApp;
