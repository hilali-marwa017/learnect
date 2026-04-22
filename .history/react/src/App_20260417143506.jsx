import { useState } from 'react'

import { RouterProvider } from 'react-router-dom';
import { router } from "./router"; /* importation de router */

function App() {
  

  return (
    <>
    <RouterProvider router={router}/>


    </>
  
  )
}

export default App
