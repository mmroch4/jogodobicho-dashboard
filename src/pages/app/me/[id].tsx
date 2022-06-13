import type { Administrator as IAdministrator } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useForm } from "react-hook-form";
import { Header } from "../../../components/Header";
import { Main } from "../../../components/Main";
import type { IResponse } from "../../../interface/api/IResponse";
import { api } from "../../../services/api";
import { getAPIClient } from "../../../services/getAPIClient";
import styles from "../../../styles/pages/app/me/[id].module.scss";

interface IInputs {
  password: string;
}

interface IProps {
  administrator: IAdministrator;
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

  return {
    props: {
      administrator,
    },
  };
};

const Page: NextPage<IProps> = ({ administrator }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IInputs>();

  async function onSubmit({ password }: IInputs) {
    try {
      await api.patch(
        `/administrator//update/password/${administrator.id}`,
        JSON.stringify({
          password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Senha editada!");

      router.push("/app/administrator");
    } catch (err) {
      alert("Senha não pode ser editada!");
    }
  }

  return (
    <>
      <Header
        config={{
          current: true,
        }}
      />

      <Main>
        <h2 className={styles.title}>Editar senha</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
