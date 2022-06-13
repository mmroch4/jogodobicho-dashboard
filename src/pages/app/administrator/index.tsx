import { Administrator as IAdministrator } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { Header } from "../../../components/Header";
import { Main } from "../../../components/Main";
import { SearchInput } from "../../../components/SearchInput";
import { useSearch } from "../../../hooks/useSearch";
import { IResponse } from "../../../interface/api/IResponse";
import { api } from "../../../services/api";
import { getAPIClient } from "../../../services/getAPIClient";
import styles from "../../../styles/pages/app/administrator/index.module.scss";
import { copyToClipboard } from "../../../utils/copyToClipboard";
import { formatValue } from "../../../utils/formatValue";
import { getLocaleTimeString } from "../../../utils/getLocaleTimeString";
import { roles } from "../../../utils/roles";

interface IProps {
  administrator: IAdministrator;
  administrators: IAdministrator[];
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

  if (!administrator || administrator.role === "ADMIN") {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  }

  const {
    data: {
      response: { payload: administrators },
    },
  } = await apiClient.get<IResponse<IAdministrator[]>>("/administrator/");

  return {
    props: {
      administrator,
      administrators,
    },
  };
};

const Page: NextPage<IProps> = ({ administrator: me, administrators }) => {
  const router = useRouter();

  const { values, search, setSearch, handleSearch } = useSearch<IAdministrator>(
    administrators,
    ({ id, created_at, role, name, phone, bank_account }) =>
      formatValue(`id:${id}`).includes(formatValue(search)) ||
      formatValue(`data:${getLocaleTimeString(created_at)}`).includes(
        formatValue(search)
      ) ||
      formatValue(`cargo:${role}`).includes(formatValue(search)) ||
      formatValue(`nome:${name}`).includes(formatValue(search)) ||
      formatValue(`tel:${phone}`).includes(formatValue(search)) ||
      formatValue(`banco:${bank_account}`).includes(formatValue(search))
  );

  async function handleDeleteAdministrator(id: string) {
    const confirmation = window.confirm(
      `Tem certeza que deseja eliminar o administrador (id: ${id})?`
    );

    if (confirmation) {
      await api.delete(`/administrator/delete/${id}`);

      alert("Administrador eliminado!");

      router.reload();
    }
  }

  return (
    <>
      <Header />

      <Main
        config={{
          current: 6,
        }}
      >
        <h2>Administradores</h2>

        <Link href="/app/administrator/create">
          <button className={styles.button}>Criar</button>
        </Link>

        <SearchInput
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />

        <div className={styles.grid}>
          {values.map((administrator) => (
            <div className={styles.box} key={administrator.id}>
              <div className={styles.buttons}>
                <div
                  title="Copiar"
                  onClick={() => copyToClipboard(administrator.id)}
                >
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

                {roles.indexOf(me.role) >= roles.indexOf("SUPERSUPERADMIN") &&
                  roles.indexOf(me.role) >
                    roles.indexOf(administrator.role) && (
                    <>
                      <Link
                        passHref
                        href={`/app/administrator/${administrator.id}`}
                      >
                        <div
                          title="Editar administrador"
                          className={styles.success}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-pencil"
                            viewBox="0 0 24 24"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
                            <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
                          </svg>
                        </div>
                      </Link>

                      <div
                        title="Eliminar administrador"
                        className={styles.danger}
                        onClick={() =>
                          handleDeleteAdministrator(administrator.id)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-trash"
                          viewBox="0 0 24 24"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <line x1="4" y1="7" x2="20" y2="7" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                        </svg>
                      </div>
                    </>
                  )}
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
                  id: <span>{administrator.id}</span>
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
                  <span>{getLocaleTimeString(administrator.created_at)}</span>
                </li>

                <li>
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
                  cargo: <span>{administrator.role}</span>
                </li>

                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-user"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <circle cx="12" cy="7" r="4" />
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                  </svg>
                  nome: <span>{administrator.name}</span>
                </li>

                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-phone"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                  </svg>
                  telefone: <span>{Number(administrator.phone)}</span>
                </li>

                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-wallet"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                    <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                  </svg>
                  conta bancária: <span>{administrator.bank_account}</span>
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
