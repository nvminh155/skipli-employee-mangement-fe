import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isServer } from "@tanstack/react-query";
import ky, { HTTPError, Input, Options } from "ky";
import { useTokenStore } from "@/stores/token.store";

type TPagination = {
  total: number;
  page: number;
  limit: number;
  filters: Record<string, string>;
};

type TPaginationRes<TData> = {
  success: true;
  count: number;
  data: {
    result: TData[];
    pagination: TPagination;
  };
};

type TSingleRes<TData> = {
  success: true;
} & Record<string, TData>;

type TErrorRes = {
  success: false;
  error: string;
  stack: string;
  code: string;
};

type TResponse<TData> = TSingleRes<TData> | TErrorRes;

type TResponseList<TData> = TPaginationRes<TData> | TErrorRes;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const kyInstance = ky.create({
  prefixUrl: BASE_URL + "/api/v1",
  retry: 0,
  hooks: {
    beforeRequest: [
      async (request, options) => {
        request.headers.set("Content-Type", "application/json");
        if (options.body) {
          request.headers.set(
            "Content-Length",
            options.body?.toString()?.length?.toString()
          );
        }
      },
    ],
  },
});

const kyInstanceAuth = ky.create({
  prefixUrl: BASE_URL + "/api/v1",
  retry: 0,
  hooks: {
    beforeRequest: [
      async (request, options) => {
        console.log("beforeRequest", typeof window);
        if (typeof window === "undefined") {
          const session = await auth();
          console.log("session", session);
          request.headers.set(
            "Authorization",
            `Bearer ${session?.user?.token}`
          );
        } else {
          console.log("useTokenStore.getState().token", useTokenStore.getState().token)
          request.headers.set(
            "Authorization",
            `Bearer ${useTokenStore.getState().token}`
          );
        }

        request.headers.set("Content-Type", "application/json");
        if (options.body) {
          request.headers.set(
            "Content-Length",
            options.body?.toString()?.length?.toString()
          );
        }
      },
    ],
  },
});

const handleError = async (error: unknown) => {
  if (error instanceof HTTPError && isServer) {
    const res = error.response;
    const req = error.request;
    const message = await res.json();
    console.log(new URL(res.url)?.pathname?.replace(BASE_URL + "/api/v1", "/"));
    console.log(Object.fromEntries(error.request.headers));
    console.log(message);

    if (res?.status === 401) redirect("/login");
  }

  if (error instanceof HTTPError) {
    const res = await error.response;
    const dataErr = await res.json();

    // console.log("r", dataErr);
    return Promise.reject({
      message: res.statusText,
      statusCode: res.status,
      ...dataErr,
    });
  }

  return Promise.reject(error);
};

export const kyApi = {
  get: async <TData = unknown>(url: Input, options?: Options) => {
    return await kyInstance
      .get(url, options)
      .json<TResponse<TData>>()
      .then((res) => {
        if (res?.success) {
          const keys = Object.keys(res);
          if (keys.length !== 2) {
            throw new Error(`more than needed`);
          }

          const dataKey = keys.find((key) => key === "data");
          if (!dataKey) {
            throw new Error(`key not found`);
          }

          if (dataKey && dataKey in res) {
            return res[dataKey];
          }

          throw new Error(`unexpected error`);
        }
      })
      .catch(handleError);
  },

  getList: async <TData = unknown>(url: Input, options?: Options) => {
    return kyInstance
      .get(url, options)
      .json<TResponseList<TData>>()
      .then((res) => {
        if (res?.success) {
          const keys = Object.keys(res);

          const additionalKey = keys.find(
            (key) => key !== "success" && key !== "count"
          );
          if (!additionalKey) {
            throw new Error(`unexpected error`);
          }
        }
      })
      .catch(handleError);
  },

  post: async <TData = unknown>(url: Input, options?: Options) => {
    return kyInstance
      .post(url, options ?? {})
      .json<TResponse<TData>>()
      .then((res) => {
        if (res?.success) {
          const keys = Object.keys(res);

          const dataKey = keys.find((key) => key === "data");
          if (!dataKey) {
            throw new Error(`key not found`);
          }

          if (dataKey && dataKey in res) {
            return res[dataKey];
          }

          throw new Error(`unexpected error`);
        }
      })
      .catch(handleError);
  },

  put: async <TData = unknown>(url: Input, options?: Options) => {
    return kyInstance
      .put(url, options ?? {})
      .json<TData>()
      .catch(handleError);
  },

  delete: async <TData>(url: Input, options?: Options) => {
    return kyInstance.delete(url, options).json<TData>().catch(handleError);
  },
};

export const kyAuthApi = {
  get: async <TData = unknown>(url: Input, options?: Options) => {
    return kyInstanceAuth
      .get(url, options)
      .json<TResponse<TData>>()
      .then((res) => {
        if (res?.success) {
          const keys = Object.keys(res);
          // if (keys.length !== 2) {
          //   throw new Error(`more than needed`);
          // }

          const additionalKey = keys.find((key) => key !== "success");
          if (!additionalKey) {
            throw new Error(`key not found`);
          }

          if (additionalKey && additionalKey in res) {
            return res[additionalKey];
          }
          throw new Error(`unexpected error`);
        }
      })
      .catch(handleError);
  },

  getList: async <TData>(url: Input, options?: Options) => {
    return kyInstanceAuth
      .post(url, options)
      .json<TResponseList<TData>>()
      .then((res) => {
        if (res?.success) {
          const keys = Object.keys(res);

          const dataKey = keys.find((key) => key === "data");
          if (!dataKey) {
            throw new Error(`key data not found`);
          }

          if (dataKey && dataKey in res) {
            return res[dataKey];
          }
          throw new Error(`unexpected error`);
        }
      })
      .catch(handleError);
  },
  getListAny: async <TData>(url: Input, options?: Options) => {
    return kyInstanceAuth
      .get(url, options)
      .json<TResponseList<TData>>()
      .then((res) => {
        if (res?.success) {
          const keys = Object.keys(res);
          if (keys.length > 4) {
            throw new Error(`more than needed`);
          }

          const additionalKey = keys.find(
            (key) => key !== "success" && key !== "count"
          );
          if (!additionalKey) {
            throw new Error(`key not found`);
          }

          if (additionalKey && additionalKey in res) {
            return { count: res.count, data: res };
          }
          throw new Error(`unexpected error`);
        }
      })
      .catch(handleError);
  },

  post: async <TData = unknown>(url: Input, options?: Options) => {
    return kyInstanceAuth
      .post(url, options ?? {})
      .json<TData>()
      .catch(handleError);
  },

  put: async <TData = unknown>(url: Input, options?: Options) => {
    return kyInstanceAuth
      .put(url, options ?? {})
      .json<TData>()
      .catch(handleError);
  },

  delete: async <TData>(url: Input, options?: Options) => {
    return kyInstanceAuth.delete(url, options).json<TData>().catch(handleError);
  },
};
