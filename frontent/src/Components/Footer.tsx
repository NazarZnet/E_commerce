import React from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
const Footer: React.FC = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-gray-900 text-gray-300 py-10">
            {/* Container */}
            <div className="max-w-7xl mx-auto px-4">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
                    {/* About Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4"> {t("about_us")} </h3>
                        <p className="text-sm">
                            {t("about_us_description")}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4"> {t("contact_us")} </h3>
                        <ul className="space-y-2">

                            <li>
                                <p className="flex items-center gap-4">
                                    <MdEmail fontSize={30} fill="#f97316" />
                                    owneremail@example.com
                                </p>
                            </li>
                            <li>
                                <p className="flex items-center gap-4">
                                    <a href="" className="cursor-pointer"><FaTelegram fontSize={30} fill="#f97316" /> </a> @Nickname
                                </p>
                            </li>
                            <li>
                                <p className="flex items-center gap-4">
                                    <a href="" className="cursor-pointer"><FaFacebook fontSize={30} fill="#f97316" /> </a> @Nickname
                                </p>
                            </li>

                        </ul>
                    </div>


                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4"> {t("stay_updated")} </h3>
                        <p className="text-sm mb-4">
                            {t("stay_updated_description")}
                        </p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder={t("auth_form_email_placeholder")}
                                className="w-3/5 px-4 py-2 rounded-l-md focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-orange-500 text-white px-1 py-2 rounded-r-md hover:bg-orange-600 transition"
                            >
                                {t("subscribe_btn")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
