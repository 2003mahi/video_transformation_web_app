import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TransformPage from './pages/TransformPage';
import GalleryPage from './pages/GalleryPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/transform',
    element: <TransformPage />,
  },
  {
    path: '/gallery',
    element: <GalleryPage />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;