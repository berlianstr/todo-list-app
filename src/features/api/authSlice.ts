import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
interface LoginResponse {
  statusCode: number;
  message: string;
  errorMessage: string | null;
  data: {
    token: string;
  };
}

export const authSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://94.74.86.174:8080/api/" }),
  endpoints: (builder) => ({
    register: builder.mutation<
      void,
      { email?: string; username: string; password: string }
    >({
      query: (user) => ({
        url: "register",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation<
      LoginResponse,
      { username: string; password: string }
    >({
      query: (user) => ({
        url: "login",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authSlice;
