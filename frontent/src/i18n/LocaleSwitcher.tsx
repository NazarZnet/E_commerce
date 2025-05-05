import { useTranslation } from "react-i18next";
import { supportedLngs } from "./config";

export default function LocaleSwitcher() {
    const { i18n } = useTranslation();

    return (

        <div className="bg-black">
            <select
                value={i18n.resolvedLanguage}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-black"
            >
                {Object.entries(supportedLngs).map(([code, name]) => (
                    <option value={code} key={code}>
                        {name}
                    </option>
                ))}
            </select>
        </div>

    );
}
