import type { Administrator as IAdministrator } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Header } from "../../../components/Header";
import { Loading } from "../../../components/Loading";
import { Main } from "../../../components/Main";
import type { IResponse } from "../../../interface/api/IResponse";
import { api } from "../../../services/api";
import { getAPIClient } from "../../../services/getAPIClient";
import styles from "../../../styles/pages/app/administrator/[id].module.scss";
import { roles } from "../../../utils/roles";

interface IInputs {
  role: "ADMIN" | "SUPERADMIN" | "SUPERSUPERADMIN" | "ODONODAPORRATODA";
  name: string;
  phone: string;
  bank_account: number;
  password: string;
}

interface IProps {
  administrator: IAdministrator;
  administratorToEdit: IAdministrator;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { "@jogodobicho:administrator:token": token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const apiClient = getAPIClient(ctx);

  const {
    data: {
      response: { payload: administrator },
    },
  } = await apiClient.get<IResponse<IAdministrator>>(
    "/administrator/me/profile"
  );

  if (!administrator) {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  }

  const { id } = ctx.params as ParsedUrlQuery;

  const {
    data: {
      response: { payload: administratorToEdit },
    },
  } = await apiClient.get<IResponse<IAdministrator>>(`/administrator/${id}`);

  if (!administratorToEdit) {
    return {
      notFound: true,
      redirect: {
        destination: "/app/administrator",
        permanent: false,
      },
    };
  } else if (
    administrator.id === administratorToEdit.id ||
    roles.indexOf(administrator.role) < roles.indexOf("SUPERSUPERADMIN") ||
    roles.indexOf(administrator.role) <= roles.indexOf(administratorToEdit.role)
  ) {
    return {
      redirect: {
        destination: "/app/administrator",
        permanent: false,
      },
    };
  }

  return {
    props: {
      administrator,
      administratorToEdit,
    },
  };
};

const Page: NextPage<IProps> = ({ administratorToEdit }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IInputs>({
    defaultValues: {
      role: administratorToEdit.role,
      name: administratorToEdit.name,
      phone: administratorToEdit.phone,
      bank_account: administratorToEdit.bank_account,
    },
  });

  async function onSubmit({
    role,
    name,
    phone,
    bank_account,
    password,
  }: IInputs) {
    try {
      setIsLoading(true);

      await api.patch(
        `/administrator/update/${administratorToEdit.id}`,
        JSON.stringify({
          role,
          name,
          phone: String(phone),
          bank_account,
          password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsLoading(false);

      alert("Administrador editado!");

      router.push("/app/administrator");
    } catch (err) {
      setIsLoading(false);

      alert("Administrador não pode ser editado!");
    }
  }

  return (
    <>
      <Loading isLoading={isLoading} />

      <Header />

      <Main>
        <h2>Editar administrador</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <label className={`${styles.field} ${styles.field_v1}`}>
            <select
              className={styles.field__input}
              placeholder="ex: ADMIN"
              {...register("role", { required: true })}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="SUPERADMIN">SUPER ADMIN</option>
              <option value="SUPERSUPERADMIN">SUPER SUPER ADMIN</option>
            </select>
            <span className={`${styles.field__icon} ${styles.field__default}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-briefcase"
                viewBox="0 0 24 24"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
                <line x1="12" y1="12" x2="12" y2="12.01" />
                <path d="M3 13a20 20 0 0 0 18 0" />
              </svg>
            </span>
            <span className={`${styles.field__icon} ${styles.field__dropdown}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-caret-down"
                viewBox="0 0 24 24"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 15l-6 -6l-6 6h12" transform="rotate(180 12 12)" />
              </svg>
            </span>
            <span className={styles.field__labelWrap}>
              <span className={styles.field__label}>Cargo</span>
            </span>
          </label>

          {errors.name?.type === "required" && "Nome é obrigatório"}
          {errors.name?.type === "minLength" &&
            "Nome deve ter entre 1 e 128 caracteres"}
          {errors.name?.type === "maxLength" &&
            "Nome deve ter entre 1 e 128 caracteres"}

          <label className={`${styles.field} ${styles.field_v1}`}>
            <input
              className={styles.field__input}
              type="text"
              placeholder="ex: Dave Crookman"
              {...register("name", {
                required: true,
                minLength: 1,
                maxLength: 128,
              })}
            />
            <span className={styles.field__icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-user"
                viewBox="0 0 24 24"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="12" cy="7" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </span>
            <span className={styles.field__labelWrap}>
              <span className={styles.field__label}>Nome</span>
            </span>
          </label>

          {errors.phone?.type === "required" && "Nº de telefone é obrigatório"}
          {errors.phone?.type === "minLength" &&
            "Nº de telefone deve ter 10 caracteres"}
          {errors.phone?.type === "maxLength" &&
            "Nº de telefone deve ter 10 caracteres"}

          <label className={`${styles.field} ${styles.field_v1}`}>
            <input
              className={styles.field__input}
              type="number"
              placeholder="ex: 1234567890"
              {...register("phone", {
                required: true,
                valueAsNumber: true,
                min: 1000000000,
                max: 9999999999,
              })}
            />
            <span className={styles.field__icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-phone"
                viewBox="0 0 24 24"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
              </svg>
            </span>
            <span className={styles.field__labelWrap}>
              <span className={styles.field__label}>Nº Telefone</span>
            </span>
          </label>

          {errors.bank_account?.type === "required" &&
            "Conta bancária é obrigatória"}
          {errors.bank_account?.type === "min" &&
            "Conta bancária deve ter 10 caracteres"}
          {errors.bank_account?.type === "max" &&
            "Conta bancária deve ter 10 caracteres"}

          <label className={`${styles.field} ${styles.field_v1}`}>
            <input
              className={styles.field__input}
              type="number"
              placeholder={`ex: 61234567`}
              {...register("bank_account", {
                required: true,
                valueAsNumber: true,
                min: 10000000,
                max: 99999999,
              })}
            />
            <span className={styles.field__icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-wallet"
                viewBox="0 0 24 24"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
              </svg>
            </span>
            <span className={styles.field__labelWrap}>
              <span className={styles.field__label}>Conta Bancária</span>
            </span>
          </label>

          {errors.password?.type === "required" && "Senha é obrigatória"}
          {errors.password?.type === "minLength" &&
            "Senha deve ter entre 12 e 128 caracteres"}
          {errors.password?.type === "maxLength" &&
            "Senha deve ter entre 12 e 128 caracteres"}

          <label className={`${styles.field} ${styles.field_v1}`}>
            <input
              className={styles.field__input}
              type="password"
              placeholder="suasenhasuperforte"
              {...register("password", {
                required: true,
                minLength: 12,
                maxLength: 128,
              })}
            />
            <span className={styles.field__icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-lock"
                viewBox="0 0 24 24"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <circle cx="12" cy="16" r="1" />
                <path d="M8 11v-4a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <span className={styles.field__labelWrap}>
              <span className={styles.field__label}>Senha</span>
            </span>
          </label>

          <button className={styles.button} type="submit">
            Editar
          </button>
        </form>
      </Main>
    </>
  );
};

export default Page;
