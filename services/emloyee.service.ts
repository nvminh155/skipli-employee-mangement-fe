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
};

export default employeeService;
