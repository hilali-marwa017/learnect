import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Home from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },


  {
    path: "/login",
    element: <h1>Hi from login page</h1>,
  },
  {
    path: "/dashboard",
    element: <h1>Hi from dashboard page</h1>,
  },
]);