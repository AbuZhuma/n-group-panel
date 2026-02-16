// src/store/useRequestsStore.ts
import { create } from "zustand";
import { getAllRequest } from "../services/getAllRequests";

export type Child = {
  full_name: string;
  age: number;
  birthCertificate: File | null;    
  path_image?: string 
};

export type RequestStatus = "APPROVED" | "REJECTED" | "NEW";

export type Request = {
  id: number;
  full_name: string;
  whatsapp_phone: string;
  is_investor: boolean;
  objects: string[];
  contract_number: string;
  children_total: number;
  children_coming: number;
  children: Child[];
  status: RequestStatus;
  reject_reason?: string
};

type RequestState = {
  requests: Request[];
  getRequest: () => void;
  approveRequest: (id: number) => void;
  rejectRequest: (id: number) => void;
};

export const useRequestsStore = create<RequestState>((set) => ({
  requests: [],
  getRequest: async() => {
    const reauests = await getAllRequest()
    set({requests: reauests})
  },
  approveRequest: (id) => {
    alert(`Заявка ${id} одобрена (статус изменится на бэке)`);
  },
  rejectRequest: (id) => {
    alert(`Заявка ${id} отклонена (статус изменится на бэке)`);
  },
}));
