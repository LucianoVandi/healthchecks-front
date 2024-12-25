import { CheckIcon, XIcon, PauseIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import { ClockIcon } from "@heroicons/react/solid";
import { useTranslation } from "../context/TranslationContext";
import moment from "moment";

const statusStyles = {
    up: "bg-green-600",
    down: "bg-red-600",
    paused: "bg-gray-600",
    grace: "bg-yellow-600",
};

const statusIcons = {
    up: <CheckIcon className="h-5 w-5 text-white" />,
    down: <XIcon className="h-5 w-5 text-white" />,
    paused: <PauseIcon className="h-5 w-5 text-white" />,
    grace: <ExclamationCircleIcon className="h-5 w-5 text-white" />,
};

const statusBorders = {
    down: "border-red-700",
    paused: "border-gray-700",
    grace: "border-yellow-800",
};

const Check = ({ name, status, last_ping, tz, last_duration }) => {
    const { translations } = useTranslation();

    return (
        <div className={`text-white bg-gray-800 rounded-lg p-4 flex items-center justify-between relative`}>
            <div
                className={`rounded-full flex justify-center items-center p-1 mr-4 relative z-10 ${statusStyles[status]}`}
                title={translations.status[status]}
            >
                {statusIcons[status]}
            </div>
            <div className="flex-1 relative z-10">
                <h3 className="font-semibold mb-1 leading-tight">{name}</h3>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                        {moment(last_ping).diff(moment(), "days") > -100
                            ? moment(last_ping).fromNow()
                            : moment(last_ping).format("DD MMMM YYYY")}
                    </span>
                    {last_duration && (
                        <span className="flex items-center">
                            <ClockIcon className="h-3 w-3 text-gray-500 mr-1" />
                            {last_duration} sec
                        </span>
                    )}
                </div>
            </div>
            {statusBorders[status] && (
                <div className={`absolute inset-0 border-2 ${statusBorders[status]} rounded-lg z-0`}></div>
            )}
        </div>
    );
};

export default Check;
