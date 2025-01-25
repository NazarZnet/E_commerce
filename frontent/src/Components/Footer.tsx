import React from "react";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10">
            {/* Container */}
            <div className="max-w-7xl mx-auto px-4">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
                    {/* About Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
                        <p className="text-sm">
                            We offer a wide range of premium electric scooters and accessories to power your ride into the future. Quality and satisfaction guaranteed!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Contact us</h3>
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
                        <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
                        <p className="text-sm mb-4">
                            Sign up for our newsletter to get the latest updates on new arrivals and exclusive offers.
                        </p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-l-md focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
