import { Administrator as IAdministrator } from "@prisma/client";
import { AxiosResponse } from "axios";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { IResponse } from "../interface/api/IResponse";
import { api } from "../services/api";

interface IAuthContextData {
  isAuthorized: boolean;
  administrator: IAdministrator | null;
  signIn: ({ bank_account, password }: ISignInProps) => Promise<void>;
  signOut: () => void;
}

interface IAuthProviderProps {
  children: ReactNode;
}

interface ISignInProps {
  bank_account: number;
  password: string;
}

interface ISignInResponse {
  token: string;
  administrator: IAdministrator;
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }: IAuthProviderProps) {
  const [administrator, setAdministrator] = useState<IAdministrator | null>(
    null
  );

  const isAuthorized = !!administrator;

  useEffect(() => {
    const { "@jogodobicho:administrator:token": token } = parseCookies();

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api
        .get("/administrator/me/profile")
        .then((response: AxiosResponse<IResponse<IAdministrator>, any>) => {
          setAdministrator(response.data.response.payload);
        });
    }
  }, []);

  async function signIn({ bank_account, password }: ISignInProps) {
    const {
      data: {
        response: {
          payload: { token, administrator },
        },
      },
    } = await api.post<IResponse<ISignInResponse>>(
      "/administrator/auth",
      {},
      {
        headers: {
          bank_account,
          password,
        },
      }
    );

    setCookie(undefined, "@jogodobicho:administrator:token", token, {
      maxAge: 2 * 60 * 60, // 2 hours
    });

    setAdministrator(administrator);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    Router.push("/app");
  }

  function signOut() {
    setAdministrator(null);

    destroyCookie({}, "@jogodobicho:administrator:token");

    Router.push("");
  }

  return (
    <AuthContext.Provider
      value={{ isAuthorized, administrator, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
