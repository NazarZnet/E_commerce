import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";

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
            <Route
              path="products/:categorySlug"
              element={<ShopPage />}
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
