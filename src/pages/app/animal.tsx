import type { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";
import { Header } from "../../components/Header";
import { Main } from "../../components/Main";
import { SearchInput } from "../../components/SearchInput";
import { useSearch } from "../../hooks/useSearch";
import { IAnimal } from "../../interface/api/IAnimal";
import { IResponse } from "../../interface/api/IResponse";
import { getAPIClient } from "../../services/getAPIClient";
import styles from "../../styles/pages/app/animal.module.scss";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { formatValue } from "../../utils/formatValue";
import { getAnimalName } from "../../utils/getAnimalName";
import { getLocaleTimeString } from "../../utils/getLocaleTimeString";

interface IProps {
  animals: IAnimal[];
  currentWinnerAnimal: IAnimal;
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
      response: { payload: animals },
    },
  } = await apiClient.get<IResponse<IAnimal[]>>("/animal");

  const {
    data: {
      response: { payload: currentWinnerAnimal },
    },
  } = await apiClient.get<IResponse<IAnimal>>("/animal/winner/current");

  return {
    props: {
      animals,
      currentWinnerAnimal,
    },
  };
};

const Page: NextPage<IProps> = ({ animals, currentWinnerAnimal }) => {
  const { values, search, setSearch, handleSearch } = useSearch<IAnimal>(
    animals,
    ({ id, created_at, animal, winners }) =>
      formatValue(`id:${id}`).includes(formatValue(search)) ||
      formatValue(`data:${getLocaleTimeString(created_at)}`).includes(
        formatValue(search)
      ) ||
      formatValue(
        `animal:${getAnimalName(animal)} animalnum:${animal}`
      ).includes(formatValue(search)) ||
      formatValue(
        winners
          .map(
            (winner) =>
              `vencedorid:${winner.id} vencedorpaycheck:${
                winner.paycheck
              } vencedorpago:${winner.paid ? "sim" : "nao|não"} vencedornome:${
                winner.name
              } vencedortel:${winner.phone} vencedorbanco:${
                winner.bank_account
              }`
          )
          .join(" ")
      ).includes(formatValue(search))
  );

  return (
    <>
      <Header />

      <Main
        config={{
          current: 4,
        }}
      >
        <h2>Animais Vencedores</h2>

        <SearchInput
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />

        <div className={styles.grid}>
          {values.map((animal) => (
            <div className={styles.box} key={animal.id}>
              <div className={styles.buttons}>
                <div title="Copiar" onClick={() => copyToClipboard(animal.id)}>
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

                {currentWinnerAnimal.id === animal.id && (
                  <div title="Animal vencedor atual" className={styles.success}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-trophy"
                      viewBox="0 0 24 24"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                      <line x1="7" y1="4" x2="17" y2="4" />
                      <path d="M17 4v8a5 5 0 0 1 -10 0v-8" />
                      <circle cx="5" cy="9" r="2" />
                      <circle cx="19" cy="9" r="2" />
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
                  id: <span>{animal.id}</span>
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
                  <span>{getLocaleTimeString(animal.created_at)}</span>
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
                  <span>{`${getAnimalName(animal.animal)} (${
                    animal.animal
                  })`}</span>
                </li>

                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-trophy"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <line x1="7" y1="4" x2="17" y2="4" />
                    <path d="M17 4v8a5 5 0 0 1 -10 0v-8" />
                    <circle cx="5" cy="9" r="2" />
                    <circle cx="19" cy="9" r="2" />
                  </svg>
                  vencedores:{" "}
                  <span>
                    <ul>
                      {animal.winners.length > 0
                        ? animal.winners.map((winner) => (
                            <li key={winner.id}>{winner.id}</li>
                          ))
                        : "0"}
                    </ul>
                  </span>
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
