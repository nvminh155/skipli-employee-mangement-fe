import { auth } from "@/auth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import StoreToken from "@/components/store-token";

const AuthPrefetch = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["token"],
    queryFn: async () => {
      const session = await auth();
      return session?.user ?? "";
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoreToken />
      {children}
    </HydrationBoundary>
  );
};

export default AuthPrefetch;
