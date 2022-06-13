import { Administrator as IAdministrator, Log as ILog } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";
import { Header } from "../../components/Header";
import { Main } from "../../components/Main";
import { SearchInput } from "../../components/SearchInput";
import { useSearch } from "../../hooks/useSearch";
import { IResponse } from "../../interface/api/IResponse";
import { getAPIClient } from "../../services/getAPIClient";
import styles from "../../styles/pages/app/log.module.scss";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { formatValue } from "../../utils/formatValue";
import { getLocaleTimeString } from "../../utils/getLocaleTimeString";
import { roles } from "../../utils/roles";

interface IProps {
  logs: ILog[];
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

  if (
    !administrator ||
    roles.indexOf(administrator.role) < roles.indexOf("SUPERSUPERADMIN")
  ) {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  }

  const {
    data: {
      response: { payload: logs },
    },
  } = await apiClient.get<IResponse<ILog[]>>("/log");

  return {
    props: {
      logs: logs.filter((log) => {
        const today = new Date().getTime();
        const creation = new Date(log.created_at).getTime();

        return today - creation < 1 * 24 * 60 * 60 * 1000; // 1 days
      }),
    },
  };
};

const Page: NextPage<IProps> = ({ logs }: IProps) => {
  const { values, search, setSearch, handleSearch } = useSearch<ILog>(
    logs,
    ({ id, created_at, action, admin_id }) =>
      formatValue(`id:${id}`).includes(formatValue(search)) ||
      formatValue(`adminid:${admin_id}`).includes(formatValue(search)) ||
      formatValue(`data:${getLocaleTimeString(created_at)}`).includes(
        formatValue(search)
      ) ||
      formatValue(`acao:${action}`).includes(formatValue(search))
  );

  return (
    <>
      <Header />

      <Main
        config={{
          current: 5,
        }}
      >
        <h2>Logs</h2>

        <SearchInput
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />

        <div className={styles.grid}>
          {values.map((log) => (
            <div className={styles.box} key={log.id}>
              <div className={styles.buttons}>
                <div title="Copiar" onClick={() => copyToClipboard(log.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-clipboard"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="2" />
                  </svg>
                </div>
              </div>

              <ul>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-id"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <rect x="3" y="4" width="18" height="16" rx="3" />
                    <circle cx="9" cy="10" r="2" />
                    <line x1="15" y1="8" x2="17" y2="8" />
                    <line x1="15" y1="12" x2="17" y2="12" />
                    <line x1="7" y1="16" x2="17" y2="16" />
                  </svg>
                  id: <span>{log.id}</span>
                </li>

                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-id"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <rect x="3" y="4" width="18" height="16" rx="3" />
                    <circle cx="9" cy="10" r="2" />
                    <line x1="15" y1="8" x2="17" y2="8" />
                    <line x1="15" y1="12" x2="17" y2="12" />
                    <line x1="7" y1="16" x2="17" y2="16" />
                  </svg>
                  administrador id: <span>{log.admin_id}</span>
                </li>

                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-clock"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 15 15" />
                  </svg>
                  data de criação:{" "}
                  <span>{getLocaleTimeString(log.created_at)}</span>
                </li>

                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-message-2"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 20l-3 -3h-2a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-2l-3 3" />
                    <line x1="8" y1="9" x2="16" y2="9" />
                    <line x1="8" y1="13" x2="14" y2="13" />
                  </svg>
                  ação: <span>{log.action}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </Main>
    </>
  );
};

export default Page;
