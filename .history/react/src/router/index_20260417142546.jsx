import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <p>Hi from home page</p>,
  },
  {
    path: "/login",
    element: <p>Hi from login page</p>,
  },
  {
    path: "/dashboard",
    element: <h1>Hi from dashboard page</h1>,
  },
]);