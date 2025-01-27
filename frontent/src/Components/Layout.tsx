import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';


const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            <Navigation />
            <main className="flex-grow  bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 shadow-lg w-full">
                <Outlet />
            </main>

            <Footer />
        </div >
    );
};

export default Layout;