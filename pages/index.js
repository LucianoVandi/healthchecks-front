import Head from "next/head";
import useSWR from "swr";
import fetcher from "../libs/fetch";
import Check from "../components/Check";
import { XIcon } from "@heroicons/react/outline";
import { useTranslation } from "../context/TranslationContext";
import { useEffect } from "react";

export async function getServerSideProps({ req }) {
    // Rileva il locale dal browser (header Accept-Language)
    const acceptLanguage = req.headers["accept-language"];
    
    const detectedLocale = acceptLanguage ? acceptLanguage.split(",")[0].split("-")[0] : "en";

    return {
        props: {
            locale: detectedLocale || "en",
        },
    };
}

export default function Home() {
    const { translations } = useTranslation();

    const { data: checks, error: errorChecks } = useSWR(
        "/v1/checks/",
        fetcher,
        { refreshInterval: 30000, refreshWhenHidden: true }
    );

    let checksOrdered = {};
    let checksTotal = 0;
    let checksError = 0;

    if (checks) {
        // Sort errors first
        checks.checks.sort(function (a) {
            return a.status == "down" ? -1 : 0;
        });

        checks.checks.forEach((check) => {
            checksTotal++;
            check.status == "down" && checksError++;
            const tagsArray = check.tags.split(" ").sort().join("");

            if (!checksOrdered[tagsArray]) {
                const status = {
                    up: 0,
                    down: 0,
                    paused: 0,
                    grace: 0,
                };

                checksOrdered[tagsArray] = {
                    items: [check],
                    tags: check.tags,
                    status: status,
                };
            } else {
                checksOrdered[tagsArray].items.push(check);
            }
            checksOrdered[tagsArray].status[check.status]++;
        });
    }

    useEffect(() => {
        document.title = checksError
            ? `${checksError} ${translations.errors.multiple}`
            : "Healthchecks Front";
    }, [checksError]);

    return (
        <div>
            <Head>
                <title>
                    {process.env.NEXT_PUBLIC_NAME
                        ? process.env.NEXT_PUBLIC_NAME
                        : "Healthchecks Front"}
                </title>
                <meta
                    name="description"
                    content={translations.meta.description}
                />
                <meta
                    property="og:title"
                    content={
                        process.env.NEXT_PUBLIC_NAME
                            ? process.env.NEXT_PUBLIC_NAME
                            : "Healthchecks Front"
                    }
                />
                <meta property="og:image" content="og_image.png" />
                <meta
                    property="og:description"
                    content={translations.meta.description}
                />
                <link
                    rel="icon"
                    href={`/${
                        checksError ? "favicon-error.ico" : "favicon.ico"
                    }`}
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1 user-scalable=no"
                />
                <link rel="apple-touch-icon" href="apple-touch-icon.png" />
            </Head>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {errorChecks && (
                    <div className="text-center m-8">
                        <div className="bg-red-600 h-16 w-16 p-3 rounded-full flex items-center justify-center mx-auto mb-3">
                            <XIcon className="w-full text-white" />
                        </div>
                        <h1 className="text-red-500 font-bold text-xl">
                            {translations.errors.fetch}
                        </h1>
                    </div>
                )}

                {checks && (
                    <div className="my-5">
                        <div className="w-36 h-36 relative mx-auto my-1s">
                            <div
                                className={`rounded-full absolute inset-6 bg-gradient-to-b ${
                                    checksError
                                        ? "from-red-400 border-red-500"
                                        : "from-green-400 border-green-500"
                                } border-2 opacity-20 z-0 animate-ping-slow`}
                            ></div>
                            <div
                                className={`rounded-full absolute inset-4 ${
                                    checksError ? "bg-red-400" : "bg-green-400"
                                } bg-opacity-10 z-10 animate-pulse`}
                            ></div>
                            <div
                                className={`rounded-full absolute inset-6 inse bg-gradient-to-b ${
                                    checksError
                                        ? "from-red-500 to-red-600 border-red-500"
                                        : "from-green-500 to-green-600 border-green-500"
                                } border-4  z-20`}
                            ></div>
                        </div>
                        <h1
                            className={`${
                                checksError ? "text-red-500" : "text-green-400"
                            } font-bold text-center text-xl`}
                        >
                            {checksError
                                ? `${checksError} ${
                                      checksError == 1 ? translations.errors.single : translations.errors.multiple
                                  }`
                                : `${checksTotal} ${
                                      checksTotal == 1 ? translations.checks.single : translations.checks.multiple
                                  }, ${translations.checks.all_fine}`}
                        </h1>
                    </div>
                )}

                {checks && (
                    <div className="space-y-12 grid grid-cols-1 mb-8">
                        {checksOrdered ? (
                            Object.entries(checksOrdered).map((checkTag, i) => (
                                <div key={i}>
                                    <div className="text-right">
                                        <div className="text-gray-400 inline-flex items-center mb-3 font-semibold">
                                            {checkTag[1].tags}

                                            {checkTag[1].status.up !== 0 && (
                                                <span
                                                    className="bg-green-900 px-3 py-1 rounded-full ml-2 font-bold text-white"
                                                    title={translations.status.up}
                                                >
                                                    {checkTag[1].status.up}
                                                </span>
                                            )}
                                            {checkTag[1].status.down !== 0 && (
                                                <span
                                                    className="bg-red-900 px-3 py-1 rounded-full ml-2 font-bold text-white"
                                                    title={translations.status.down}
                                                >
                                                    {checkTag[1].status.down}
                                                </span>
                                            )}
                                            {checkTag[1].status.paused !==
                                                0 && (
                                                <span
                                                    className="bg-gray-800 px-3 py-1 rounded-full ml-2 font-bold text-white"
                                                    title={translations.status.paused}
                                                >
                                                    {checkTag[1].status.paused}
                                                </span>
                                            )}
                                            {checkTag[1].status.grace !== 0 && (
                                                <span
                                                    className="bg-yellow-800 px-3 py-1 rounded-full ml-2 font-bold text-white"
                                                    title={translations.status.grace}
                                                >
                                                    {checkTag[1].status.grace}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                        {checkTag[1] &&
                                            checkTag[1].items instanceof
                                                Array &&
                                            checkTag[1].items.map(
                                                (check, i) => (
                                                    <Check
                                                        name={check.name}
                                                        status={check.status}
                                                        last_ping={
                                                            check.last_ping
                                                        }
                                                        tz={check.tz}
                                                        key={i}
                                                        last_duration={
                                                            check.last_duration
                                                                ? check.last_duration
                                                                : null
                                                        }
                                                    />
                                                )
                                            )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {checks &&
                                    checks.checks &&
                                    checks.checks instanceof Array &&
                                    checks.checks.map((check, i) => (
                                        <Check
                                            name={check.name}
                                            status={check.status}
                                            last_ping={check.last_ping}
                                            tz={check.tz}
                                            last_duration={
                                                check.last_duration
                                                    ? check.last_duration
                                                    : null
                                            }
                                            key={i}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
