import Link from "next/link";
import { ReactNode, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { roles } from "../../utils/roles";
import styles from "./styles.module.scss";

interface IProps {
  config?: {
    current: 1 | 2 | 3 | 4 | 5 | 6;
  };
  children: ReactNode;
}

export const Main = ({ config, children }: IProps) => {
  const { administrator } = useContext(AuthContext);

  if (!administrator) return <></>;

  return (
    <div className={styles.wrapper}>
      <nav className={styles.inner}>
        <ul>
          <li className={config?.current === 1 ? styles.current : ""}>
            <Link href={"/app/bet"}>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-cash"
                  viewBox="0 0 24 24"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <rect x="7" y="9" width="14" height="10" rx="2" />
                  <circle cx="14" cy="14" r="2" />
                  <path d="M17 9v-2a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h2" />
                </svg>
                Apostas
              </span>
            </Link>
          </li>
          <li className={config?.current === 2 ? styles.current : ""}>
            <Link href={"/app/pending"}>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-cash"
                  viewBox="0 0 24 24"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <rect x="7" y="9" width="14" height="10" rx="2" />
                  <circle cx="14" cy="14" r="2" />
                  <path d="M17 9v-2a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h2" />
                </svg>
                Apostas pendentes
              </span>
            </Link>
          </li>
          <li className={config?.current === 3 ? styles.current : ""}>
            <Link href={"/app/winner"}>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-award"
                  viewBox="0 0 24 24"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <circle cx="12" cy="9" r="6" />
                  <polyline
                    points="9 14.2 9 21 12 19 15 21 15 14.2"
                    transform="rotate(-30 12 9)"
                  />
                  <polyline
                    points="9 14.2 9 21 12 19 15 21 15 14.2"
                    transform="rotate(30 12 9)"
                  />
                </svg>
                Vencedores
              </span>
            </Link>
          </li>
          <li className={config?.current === 4 ? styles.current : ""}>
            <Link href={"/app/animal"}>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-fish"
                  viewBox="0 0 24 24"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M16.69 7.44a6.973 6.973 0 0 0 -1.69 4.56c0 1.747 .64 3.345 1.699 4.571" />
                  <path d="M2 9.504c7.715 8.647 14.75 10.265 20 2.498c-5.25 -7.761 -12.285 -6.142 -20 2.504" />
                  <path d="M18 11v.01" />
                  <path d="M11.5 10.5c-.667 1 -.667 2 0 3" />
                </svg>
                Animais
              </span>
            </Link>
          </li>
          {administrator &&
            roles.indexOf(administrator.role) >=
              roles.indexOf("SUPERSUPERADMIN") && (
              <li className={config?.current === 5 ? styles.current : ""}>
                <Link href={"/app/log"}>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-history"
                      viewBox="0 0 24 24"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <polyline points="12 8 12 12 14 14" />
                      <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
                    </svg>
                    Logs
                  </span>
                </Link>
              </li>
            )}
          {administrator &&
            roles.indexOf(administrator.role) >=
              roles.indexOf("ADMIN") && (
              <li className={config?.current === 6 ? styles.current : ""}>
                <Link href={"/app/administrator"}>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-users"
                      viewBox="0 0 24 24"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                    </svg>
                    Administradores
                  </span>
                </Link>
              </li>
            )}
        </ul>
      </nav>

      <main className={styles.inner}>{children}</main>
    </div>
  );
};
