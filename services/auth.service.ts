import { kyApi } from "@/lib/ky";
import { TUser } from "@/types/user";

const authService = {
  createAccessCode: async (email: string) => {
   try {
    const res = await kyApi.post("auth/CreateNewAccessCode", {

      json: { email },
    });
    return res;
   } catch (error) {
    throw error;
   }
  },
  verifyCode: async (email: string, code: string) => {
    const res = await kyApi.post<TUser>("auth/ValidateAccessCode", {
      json: {
        email,
        code,
      },
    });
    return res;
  },
};

export default authService;
