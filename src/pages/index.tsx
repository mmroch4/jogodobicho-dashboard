import type { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Header } from "../components/Header";
import { AuthContext } from "../contexts/auth";
import styles from "../styles/pages/index.module.scss";

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
  const { register, handleSubmit } = useForm();

  const { signIn } = useContext(AuthContext);

  async function handleSignIn(data: any) {
    try {
      await signIn({
        bank_account: data.bank_account,
        password: data.password,
      });

      alert("Autenticado com sucesso!");
    } catch (err) {
      alert("Credenciais Inválidas!");
    }
  }

  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <h2>Entrar</h2>

          <form onSubmit={handleSubmit(handleSignIn)}>
            <label className={`${styles.field} ${styles.field_v1}`}>
              <input
                className={styles.field__input}
                placeholder="ex: 61234567"
                {...register("bank_account", { required: true })}
                type="password"
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
