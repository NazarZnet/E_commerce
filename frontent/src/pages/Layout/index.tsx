import { Outlet } from 'react-router-dom';
import Navigation from '../../Components/Navigtaion';

const Layout = () => {
    return (
        <div>
            <Navigation />
            <main>
                <Outlet />
            </main>

            <footer>
                <p>&copy; 2025 Your Website</p>
            </footer>
        </div >
    );
};

export default Layout;