import {api} from "../api/api";

export const getRequestById = async(id: string) => {
    try {
        const res = await api.get(`/admin/applications/${id}`)
        console.log(res);
    
        return res.data
    } catch (error) {
        console.log(error);
        return []
    }
}