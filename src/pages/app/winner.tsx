import type { Administrator as IAdministrator } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useState } from "react";
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { Main } from "../../components/Main";
import { SearchInput } from "../../components/SearchInput";
import { useSearch } from "../../hooks/useSearch";
import { IResponse } from "../../interface/api/IResponse";
import { IWinner } from "../../interface/api/IWinner";
import { api } from "../../services/api";
import { getAPIClient } from "../../services/getAPIClient";
import styles from "../../styles/pages/app/winner.module.scss";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { formatter } from "../../utils/formatCurrency";
import { formatValue } from "../../utils/formatValue";
import { getAnimalName } from "../../utils/getAnimalName";
import { getLocaleTimeString } from "../../utils/getLocaleTimeString";
import { roles } from "../../utils/roles";

interface IProps {
  winners: IWinner[];
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

  const {
    data: {
      response: { payload: winners },
    },
  } = await apiClient.get<IResponse<IWinner[]>>("/winner");

  return {
    props: {
      winners,
      administrator,
    },
  };
};

const Page: NextPage<IProps> = ({ winners, administrator }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const { values, search, setSearch, handleSearch } = useSearch<IWinner>(
    winners,
    ({
      id,
      created_at,
      animalId,
      animal: { animal },
      name,
      phone,
      bank_account,
      paycheck,
      paid,
    }) => {
      return (
        formatValue(`id:${id}`).includes(formatValue(search)) ||
        formatValue(`data:${getLocaleTimeString(created_at)}`).includes(
          formatValue(search)
        ) ||
        formatValue(`pago:${paid ? "sim" : "nao|não"}`).includes(
          formatValue(search)
        ) ||
        formatValue(`paycheck:${paycheck}`).includes(formatValue(search)) ||
        formatValue(`animalid:${animalId}`).includes(formatValue(search)) ||
        formatValue(
          `animal:${getAnimalName(animal)} animalnum:${animal}`
        ).includes(formatValue(search)) ||
        formatValue(`nome:${name}`).includes(formatValue(search)) ||
        formatValue(`tel:${phone}`).includes(formatValue(search)) ||
        formatValue(`banco:${bank_account}`).includes(formatValue(search))
      );
    }
  );

  async function handlePayWinner(id: string) {
    const confirmation = window.confirm(
      `Tem certeza que deseja pagar o vencedor (id: ${id})?`
    );

    if (confirmation) {
      try {
        setIsLoading(true);

        await api.patch(`/winner/pay/${id}`);

        setIsLoading(false);

        alert("Vencedor pago!");

        router.reload();
      } catch (err) {
        setIsLoading(false);

        alert("Vencedor não pode ser pago!");
      }
    }
  }

  return (
    <>
      <Loading isLoading={isLoading} />

      <Header />

      <Main
        config={{
          current: 3,
        }}
      >
        <h2>Vencedores</h2>

        <SearchInput
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />

        <div className={styles.grid}>
          {values.map((winner) => (
            <div className={styles.box} key={winner.id}>
              <div className={styles.buttons}>
                <div title="Copiar" onClick={() => copyToClipboard(winner.id)}>
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

                {!winner.paid &&
                  roles.indexOf(administrator.role) >=
                    roles.indexOf("SUPERSUPERADMIN") && (
                    <div
                      title="Pagar aposta"
                      className={styles.success}
                      onClick={() => handlePayWinner(winner.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-receipt-2"
                        viewBox="0 0 24 24"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
                        <path d="M14 8h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5m2 0v1.5m0 -9v1.5" />
                      </svg>
                    </div>
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
                  id: <span>{winner.id}</span>
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
                  <span>{getLocaleTimeString(winner.created_at)}</span>
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
                  id do animal: <span>{winner.animalId}</span>
                </li>

                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-receipt-2"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
                    <path d="M14 8h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5m2 0v1.5m0 -9v1.5" />
                  </svg>
                  pago: <span>{winner.paid ? "sim" : "não"}</span>
                </li>

                <li>
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
                  paycheck: <span>{formatter.format(winner.paycheck)}</span>
                </li>

                <li>
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
                  animal:{" "}
                  <span>{`${getAnimalName(winner.animal.animal)} (${
                    winner.animal.animal
                  })`}</span>
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
                  nome: <span>{winner.name}</span>
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
                  telefone: <span>{winner.phone}</span>
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
                  conta bancária: <span>{winner.bank_account}</span>
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
