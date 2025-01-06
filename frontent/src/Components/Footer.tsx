import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10">
            {/* Container */}
            <div className="max-w-7xl mx-auto px-4">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
                    {/* About Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
                        <p className="text-sm">
                            We offer a wide range of premium electric scooters and accessories to power your ride into the future. Quality and satisfaction guaranteed!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/about" className="hover:text-orange-500 transition">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="hover:text-orange-500 transition">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="/faq" className="hover:text-orange-500 transition">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="/policy" className="hover:text-orange-500 transition">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Customer Service
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/shipping" className="hover:text-orange-500 transition">
                                    Shipping & Returns
                                </a>
                            </li>
                            <li>
                                <a href="/warranty" className="hover:text-orange-500 transition">
                                    Warranty Information
                                </a>
                            </li>
                            <li>
                                <a href="/support" className="hover:text-orange-500 transition">
                                    Support Center
                                </a>
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

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-sm text-gray-400">
                    <p>© 2025 RideFuture. All Rights Reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="/terms" className="hover:text-orange-500 transition">
                            Terms of Service
                        </a>
                        <a href="/policy" className="hover:text-orange-500 transition">
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
