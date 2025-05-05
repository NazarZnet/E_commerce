import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import OrderPage from "./pages/Order";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
import OrderStatusPage from "./pages/OrderStatus";
import HelpCenter from "./pages/Help";

const MainPage = lazy(() => import("./pages/Main"));
const ShopPage = lazy(() => import("./pages/Shop"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetails"));
function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainPage />} />
            <Route path="products/:slug" element={<ProductDetailsPage />} />
            <Route path="products" element={<ShopPage />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="order/finished" element={<OrderStatusPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="help" element={<HelpCenter />} />


          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
