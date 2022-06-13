import type { Bet as IBet } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";
import { Bet } from "../../components/Bet";
import { Header } from "../../components/Header";
import { Main } from "../../components/Main";
import { SearchInput } from "../../components/SearchInput";
import { useSearch } from "../../hooks/useSearch";
import type { IResponse } from "../../interface/api/IResponse";
import { getAPIClient } from "../../services/getAPIClient";
import styles from "../../styles/pages/app/bet.module.scss";
import { formatValue } from "../../utils/formatValue";
import { getAnimalName } from "../../utils/getAnimalName";
import { getLocaleTimeString } from "../../utils/getLocaleTimeString";

interface IProps {
  bets: IBet[];
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
      response: { payload: bets },
    },
  } = await apiClient.get<IResponse<IBet[]>>("/bet");

  return {
    props: {
      bets,
    },
  };
};

const Page: NextPage<IProps> = ({ bets }) => {
  const { values, search, setSearch, handleSearch } = useSearch<IBet>(
    bets,
    ({ id, created_at, value, animal, name, phone, bank_account }) =>
      formatValue(`id:${id}`).includes(formatValue(search)) ||
      formatValue(`data:${getLocaleTimeString(created_at)}`).includes(
        formatValue(search)
      ) ||
      formatValue(`valor:${value}`).includes(formatValue(search)) ||
      formatValue(
        `animal:${getAnimalName(animal)} animalnum:${animal}`
      ).includes(formatValue(search)) ||
      formatValue(`nome:${name}`).includes(formatValue(search)) ||
      formatValue(`tel:${phone}`).includes(formatValue(search)) ||
      formatValue(`banco:${bank_account}`).includes(formatValue(search))
  );

  return (
    <>
      <Header />

      <Main
        config={{
          current: 1,
        }}
      >
        <h2>Apostas</h2>

        <SearchInput
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />

        <div className={styles.grid}>
          {values.map((bet) => (
            <Bet key={bet.id} bet={bet} />
          ))}
        </div>
      </Main>
    </>
  );
};

export default Page;
