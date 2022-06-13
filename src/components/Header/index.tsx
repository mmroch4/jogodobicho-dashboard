import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import styles from "./styles.module.scss";

interface IProps {
  config?: {
    current: boolean;
  };
}

export const Header = ({ config }: IProps) => {
  const { administrator, signOut } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <Link href={administrator ? "/app" : "/"}>
        <h2>Painel</h2>
      </Link>

      {administrator ? (
        <>
          <Link href={"/app/me"}>
            <span
              title="Meu perfil"
              className={config?.current ? styles.active : ""}
            >
              {administrator.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-user-circle"
                viewBox="0 0 24 24"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="10" r="3" />
                <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
              </svg>
            </span>
          </Link>

          <span className={styles.button} title="Sair" onClick={signOut}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-logout"
              viewBox="0 0 24 24"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M7 12h14l-3 -3m0 6l3 -3" />
            </svg>
          </span>
        </>
      ) : (
        <Link href={"/"}>
          <span className={styles.button} title="Login">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-login"
              viewBox="0 0 24 24"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M20 12h-13l3 -3m0 6l-3 -3" />
            </svg>
          </span>
        </Link>
      )}
    </header>
  );
};
