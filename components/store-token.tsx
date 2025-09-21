"use client";

import { useTokenStore } from "@/stores/token.store";
import { useQuery } from "@tanstack/react-query";

const StoreToken = () => {
  const { data: token } = useQuery({
    queryKey: ["token"],
    queryFn: () => {
      return {
        token: "",
      };
    },
    select: (data) => {
      console.log("data", data);
      const storedToken = useTokenStore.getState().token;
      if (!data.token && storedToken) {
        useTokenStore.getState().clearToken();
        return data;
      }
const token = useTokenStore.getState().token;
console.log("token", token)
      if (!useTokenStore.getState().token) {
        useTokenStore.setState({ token: data.token })
      };
      return data;
    },
    staleTime: Infinity,
  });

  return null;
};

export default StoreToken;
