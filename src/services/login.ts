import {api} from "../api/api"

export const login = async (body: { username: string, password: string }) => {
    try {
        const res = await api.post("/admin/auth/login", body)
        localStorage.setItem("token", res.data.access_token)
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}