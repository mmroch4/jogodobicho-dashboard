import { Bet as IBet } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";
import { Header } from "../../components/Header";
import { Main } from "../../components/Main";
import { IAnimal } from "../../interface/api/IAnimal";
import { IResponse } from "../../interface/api/IResponse";
import { getAPIClient } from "../../services/getAPIClient";
import styles from "../../styles/pages/app/index.module.scss";
import { formatter } from "../../utils/formatCurrency";
import { getAnimalName } from "../../utils/getAnimalName";

interface IProps {
  createdBetsToday: number;
  lastWinnerAnimal: string;
  totalGambledToday: number;
  totalGambled: number;
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

  const createdBetsToday = await bets.filter((bet) => {
    const today = new Date();
    const betDate = new Date(bet.created_at);

    return (
      today.getDate() === betDate.getDate() &&
      today.getMonth() === betDate.getMonth() &&
      today.getFullYear() === betDate.getFullYear()
    );
  });

  const totalGambled = bets.reduce((total, bet) => total + bet.value, 0);
  const totalGambledToday = createdBetsToday.reduce(
    (total, bet) => total + bet.value,
    0
  );

  const {
    data: {
      response: { payload: lastWinnerAnimal },
    },
  } = await apiClient.get<IResponse<IAnimal>>("/animal/winner/current");

  return {
    props: {
      createdBetsToday: createdBetsToday.length,
      lastWinnerAnimal: lastWinnerAnimal
        ? getAnimalName(lastWinnerAnimal.animal)
        : "Nenhum",
      totalGambledToday,
      totalGambled,
    },
  };
};

const Page: NextPage<IProps> = ({
  createdBetsToday,
  lastWinnerAnimal,
  totalGambledToday,
  totalGambled,
}: IProps) => {
  return (
    <>
      <Header />

      <Main>
        <>
          <h2>Atividade</h2>

          <div className={styles.box_grid}>
            <div className={styles.box}>
              <h3>Apostas criadas hoje</h3>
              <p>{createdBetsToday}</p>
            </div>

            <div className={styles.box}>
              <h3>Último animal vencedor</h3>
              <p>{lastWinnerAnimal}</p>
            </div>

            <div className={styles.box}>
              <h3>Total apostado hoje</h3>
              <p>{formatter.format(totalGambledToday)}</p>
            </div>

            <div className={styles.box}>
              <h3>Total de apostado acumulado</h3>
              <p>{formatter.format(totalGambled)}</p>
            </div>
          </div>
        </>
      </Main>
    </>
  );
};

export default Page;
