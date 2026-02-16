import { api } from "../api/api";

export const statusChange = async(id: string, status: "approve" | "reject", reason?: string) => {
    try {
        await api.post(`/admin/applications/${id}/${status}`, {reason: reason})
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}