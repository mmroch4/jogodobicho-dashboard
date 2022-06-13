import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  const { "@jogodobicho:administrator:token": token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:8000",
  });

  if (token) {
    api.defaults.headers.common.authorization = `Bearer ${token}`;
  }

  return api;
}
