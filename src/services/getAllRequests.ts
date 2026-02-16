import {api} from "../api/api";

export const getAllRequest = async() => {
    try {
        const res = await api.get("/admin/applications")
        return res.data.items
    } catch (error) {
        console.log(error);
        return []
    }
}