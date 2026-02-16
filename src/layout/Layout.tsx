import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

const Layout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        if(!localStorage.getItem("token")){
            navigate("/login")
        }
    }, [])
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default Layout