import axios from "axios";

export const fetcher = async (path: string) => {
  const baseURL = `http://localhost:5000${path}`;
  const options = {};
  const api = axios.create({
    baseURL,
  });

  const result = await api.request({
    baseURL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  });

  return result.data;
};
