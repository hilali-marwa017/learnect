import { Outlet } from "react-router-dom"

function Layout(){
    return(
        <>
        <header>This is Header</header>

        <main>
            <Outlet

        </main>

        <footer>This is Footer</footer>
        </>
    )
}

export default Layout