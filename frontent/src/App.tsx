import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import ProductDetailsPage from "./pages/ProductDetails";
import ProductListPage from "./pages/ProductList";

const MainPage = lazy(() => import("./pages/Main"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainPage />} />
            <Route path="products/:slug" element={<ProductDetailsPage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route
              path="products/:categorySlug"
              element={<ProductListPage />}
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
