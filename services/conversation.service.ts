import { kyApi, kyAuthApi } from "@/lib/ky";
import { TConversation } from "@/types/conversation";
import { TUser } from "@/types/user";

const PATH = "conversations";

export type TEmployee = TUser;

const employeeService = {
  getById: async (id: string) => {
    const res = await kyAuthApi.get<TConversation>(`${PATH}/${id}`);
    return res;
  },
};

export default employeeService;
