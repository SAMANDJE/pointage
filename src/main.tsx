import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { HomePage } from '@/pages/HomePage';
import { HistoryPage } from '@/pages/HistoryPage';
import { RoomsPage } from '@/pages/RoomsPage';
import { Layout } from '@/components/Layout';
const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/history",
        element: <HistoryPage />,
      },
      {
        path: "/rooms",
        element: <RoomsPage />,
      },
    ],
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);