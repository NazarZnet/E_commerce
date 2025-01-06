import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';

const MainPage = lazy(() => import('./pages/Main'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<MainPage />} />

          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
