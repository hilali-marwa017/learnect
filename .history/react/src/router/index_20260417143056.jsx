import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dsahboard from "../pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },


  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/dashboard",
    element: <h1>Hi from dashboard page</h1>,
  },
]);