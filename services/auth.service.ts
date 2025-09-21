import { kyApi } from "@/lib/ky";
import { TUser } from "@/types/user";

const authService = {
  createAccessCode: async (email: string) => {
   try {
    console.log("createAccessCode", email);
    const res = await kyApi.post("auth/CreateNewAccessCode", {

      json: { email },
    });
    console.log("createAccessCode res", res);
    return res;
   } catch (error) {
    console.log("createAccessCode error", error);
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
