import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dsahboard from "../pages/Dashboard";
import Layout from "../../public/layouts/Layout";

export const router = createBrowserRouter([

    {
        element:<Layout></Layout>
    }
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
    element: <Dsahboard/>,
  },
  {
    path: "*",
    element: <h1>Not Found 404 !!</h1>,
  },
]);