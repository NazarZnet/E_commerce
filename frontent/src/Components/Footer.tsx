import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// import { FaFacebook, FaTelegram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { subscribeUser } from "../utils/api";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setStatus("error");
            setTimeout(() => setStatus(null), 10000);
            return;
        }

        setLoading(true);
        try {
            await subscribeUser(email);
            setStatus("success");
            setEmail("");

        } catch (error) {
            console.error("Subscription error:", error);
            setStatus("error");
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(null), 10000);
        }
    };

    return (
        <footer className="bg-gray-900 text-gray-300 py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
                    {/* About Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">{t("about_us")}</h3>
                        <p className="text-sm">{t("about_us_description")}</p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">{t("contact_us")}</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/help" className="flex items-center gap-4">
                                    <MdEmail fontSize={30} fill="#f97316" />
                                    {t("help_center")}
                                </Link>
                            </li>
                            {/* <li>
                                <p className="flex items-center gap-4">
                                    <a href="" className="cursor-pointer">
                                        <FaTelegram fontSize={30} fill="#f97316" />
                                    </a>{" "}
                                    @Nickname
                                </p>
                            </li>
                            <li>
                                <p className="flex items-center gap-4">
                                    <a href="" className="cursor-pointer">
                                        <FaFacebook fontSize={30} fill="#f97316" />
                                    </a>{" "}
                                    @Nickname
                                </p>
                            </li> */}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">{t("stay_updated")}</h3>
                        <p className="text-sm mb-4">{t("stay_updated_description")}</p>

                        <form onSubmit={handleSubmit} className="flex relative">
                            <input
                                type="email"
                                placeholder={t("auth_form_email_placeholder")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className=" text-black w-3/5 px-4 py-2 rounded-l-md focus:outline-none"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-orange-500 text-white px-3 py-2 rounded-r-md transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
                                    }`}
                            >
                                {loading ? t("subscribe_btn_loading") : t("subscribe_btn")}
                            </button>
                        </form>

                        {/* Status Icons */}
                        {status === "success" && (
                            <div className=" text-green-500 mt-2">

                                <span>{t("subscription_success")}</span>
                            </div>
                        )}
                        {status === "error" && (
                            <div className=" text-red-500 mt-2">

                                <span>{t("subscription_failed")}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;