import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AuthRoute from "./AuthRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import ProductDetailPage from "../pages/ProductDetailPage.jsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },

      {
        element: <AuthRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [],
      },

      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
        ],
      },
    ],
  },
]);
