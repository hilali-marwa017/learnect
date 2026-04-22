import { useState } from 'react'

import { RouterProvider } from 'react-router-dom';
import { Router } from "react-router-dom";
import { router } from "./router"; 

function App() {
  

  return (
    <>
    <RouterProvider router={router}/>
    <RouterProvider router={router}/>
    <RouterProvider router={router}/>


    </>
  
  )
}

export default App
