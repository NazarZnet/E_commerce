import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <header className='bg-black text-white'>
                <nav className="flex items-center justify-between px-6 py-4 bg-black text-white">
                    {/* Left Section: Logo */}
                    <div className="flex items-center space-x-3">
                        <img
                            src="https://via.placeholder.com/50x50"
                            alt="Logo"
                            className="w-10 h-10"
                        />
                        <span className="text-orange-500 font-bold text-lg">KugooKirin</span>
                    </div>

                    {/* Center Section: Links */}
                    <ul className="flex items-center space-x-6 text-sm font-medium">
                        <li>
                            <a
                                href="#"
                                className="flex items-center space-x-1 hover:text-orange-400"
                            >
                                <span>🎅</span>
                                <span>Christmas</span>
                                <span>🎅</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-400">
                                New Arrival
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-400">
                                Electric Scooters
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-400">
                                Electric Bikes
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-400">
                                Spare Parts
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-400">
                                Support
                            </a>
                        </li>
                    </ul>

                    {/* Right Section: Icons */}
                    <div className="flex items-center space-x-4">
                        <a href="#" className="hover:text-orange-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 14v2m0 4h.01M12 10a4 4 0 110-8 4 4 0 010 8z"
                                />
                            </svg>
                        </a>
                        <a href="#" className="hover:text-orange-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 16l4-4-4-4m8 8l-4-4 4-4"
                                />
                            </svg>
                        </a>
                        <a href="#" className="relative hover:text-orange-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2M7 13h10l1-5H6l1 5zm5 5a3 3 0 100-6 3 3 0 000 6z"
                                />
                            </svg>
                            {/* Red Dot Notification */}
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </a>
                    </div>
                </nav>
            </header>

            <main className='md:w-[80%] mx-auto'>
                <Outlet />
            </main>

            <footer>
                <p>&copy; 2025 Your Website</p>
            </footer>
        </div>
    );
};

export default Layout;