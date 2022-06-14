import type { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { AuthContext } from "../contexts/auth";
import styles from "../styles/pages/index.module.scss";

interface IOnSubmitProps {
  bank_account: number;
  password: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { "@jogodobicho:administrator:token": token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Page: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<IOnSubmitProps>();

  const { signIn } = useContext(AuthContext);

  async function onSubmit({ bank_account, password }: IOnSubmitProps) {
    try {
      setIsLoading(true);

      await signIn({
        bank_account,
        password,
      });

      setIsLoading(false);

      alert("Autenticado com sucesso!");
    } catch (err) {
      setIsLoading(false);

      alert("Credenciais Inválidas!");
    }
  }

  return (
    <>
      <Loading isLoading={isLoading} />

      <Header />

      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <h2>Entrar</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className={`${styles.field} ${styles.field_v1}`}>
              <input
                className={styles.field__input}
                placeholder="ex: 61234567"
                {...register("bank_account", {
                  required: true,
                  valueAsNumber: true,
                })}
                type="number"
                autoComplete="jogo do bicho - conta bancária"
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

            <label className={`${styles.field} ${styles.field_v1}`}>
              <input
                className={styles.field__input}
                placeholder="ex: suasenhasuperforte"
                {...register("password", { required: true })}
                type="password"
                autoComplete="jogo do bicho - senha"
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
              Entrar
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
