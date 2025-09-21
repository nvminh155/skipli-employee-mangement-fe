import { kyApi, kyAuthApi } from "@/lib/ky";
import { TUser } from "@/types/user";

const PATH = "employees";

export type TEmployee = TUser;

const employeeService = {
  getList: async ({
    filters,
    page,
    limit,
  }: {
    filters: Record<string, string>;
    page: number;
    limit: number;
  }) => {
    const res = await kyAuthApi.getList<TEmployee>(PATH, {
      json: {
        filters,
        page,
        limit,
      },
    });
    return res;
  },
  create: async (
    data: Omit<TEmployee, "id" | "token" | "status" | "password" | "username">
  ) => {
    const res = await kyAuthApi.post(PATH + "/createEmployee", {
      json: data,
    });
    return res;
  },
  delete: async (id: string) => {
    const res = await kyAuthApi.delete(PATH + "/" + id);
    return res;
  },
  getById: async (id: string) => {
    const res = await kyAuthApi.get<TEmployee>(PATH + "/" + id);
    return res;
  },
  update: async (
    id: string,
    data: Omit<TEmployee, "id" | "token" | "status" | "password" | "username">
  ) => {
    const res = await kyAuthApi.put<TEmployee>(PATH + "/" + id, {
      json: data,
    });
    return res;
  },
};

export default employeeService;
