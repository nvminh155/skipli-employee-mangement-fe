import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isServer } from "@tanstack/react-query";
import ky, { HTTPError, Input, Options } from "ky";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";

type TPaginationRes<TData> = {
  success: true;
  count: number;
} & Record<string, TData[]> & {
    CourseByMenter: {
      count: number;
      courses: TData[];
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
        if (typeof window === "undefined") {
          const session = await auth();
          request.headers.set(
            "Authorization",
            `Bearer ${session?.user?.token}`
          );
        } else {
          request.headers.set(
            "Authorization",
            `Bearer ${localStorage.getItem("token")}`
          );
        }

        // request.headers.set("Content-Type", "application/json");
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
            const isGetCourseByMentor = keys.find((k) => k === "CourseByMenter");

            if (isGetCourseByMentor) {
              return {
                count: res.CourseByMenter.count,
                data: res.CourseByMenter.courses,
              };
            }

            if (keys.length === 4) {
              if (res && res.getMentor) {
                return {
                  count: Number(res.totalPages) * 12,
                  data: res.getMentor,
                };
              }
            }
            if (keys.length !== 3) {
              throw new Error(`more than needed`);
            }

            const additionalKey = keys.find(
              (key) => key !== "success" && key !== "count"
            );
            if (!additionalKey) {
              throw new Error(`key not found`);
            }

            if (additionalKey && additionalKey in res) {
              return { count: res.count, data: res[additionalKey] };
            }
            throw new Error(`unexpected error`);
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
  getAny: async <TData = unknown>(url: Input, options?: Options) => {
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
            return res;
          }
          throw new Error(`unexpected error`);
        }
      })
      .catch(handleError);
  },

  getList: async <TData>(url: Input, options?: Options) => {
    return kyInstanceAuth
      .get(url, options)
      .json<TResponseList<TData>>()
      .then((res) => {
        if (res?.success) {
          const keys = Object.keys(res);
          if (keys.length > 3) {
            throw new Error(`more than needed`);
          }

          const additionalKey = keys.find(
            (key) => key !== "success" && key !== "count"
          );
          if (!additionalKey) {
            throw new Error(`key not found`);
          }

          if (additionalKey && additionalKey in res) {
            return { count: res.count, data: res[additionalKey] };
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
