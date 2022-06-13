import { Bet as IBet } from "@prisma/client";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { IResponse } from "../../interface/api/IResponse";
import { api } from "../../services/api";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { formatter } from "../../utils/formatCurrency";
import { getAnimalName } from "../../utils/getAnimalName";
import { getLocaleTimeString } from "../../utils/getLocaleTimeString";
import { Loading } from "../Loading";
import styles from "./styles.module.scss";

type IMixedBet = IBet & {
  token?: string;
};

interface IProps {
  type?: "pendingBet" | "bet";
  bet: IMixedBet;
}

export function Bet({ type = "bet", bet }: IProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleDeleteBet() {
    const confirmation = window.confirm(
      `Tem certeza que deseja eliminar a aposta (id: ${bet.id})?`
    );

    if (confirmation) {
      try {
        setIsLoading(true);

        await api.delete(`/bet/delete/${bet.id}`);

        setIsLoading(false);

        alert("Aposta eliminada!");

        router.reload();
      } catch (err) {
        setIsLoading(false);

        alert("Aposta não pode ser eliminada!");
      }
    }
  }

  async function handleValidateBet() {
    const confirmation = window.confirm(
      `Tem certeza que deseja validar a aposta (token: ${bet.token})?`
    );

    if (confirmation) {
      try {
        setIsLoading(true);

        await api.post(`/bet/validate/${bet.token}`);

        setIsLoading(false);

        alert("Aposta validada!");

        router.reload();
      } catch (err: any) {
        setIsLoading(false);

        alert("Aposta não pode ser validada!");
        alert(err.response.data.message as AxiosError<IResponse<{}>>);
      }
    }
  }

  return (
    <>
      <Loading isLoading={isLoading} />

      <div className={`${styles.box}`}>
        <div className={styles.buttons}>
          <div
            title="Copiar"
            onClick={() =>
              copyToClipboard(type === "pendingBet" ? bet.token : bet.id)
            }
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

          {type === "bet" && (
            <div
              title="Eliminar aposta"
              className={styles.danger}
              onClick={handleDeleteBet}
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
          )}

          {type === "pendingBet" && (
            <div
              title="Validar aposta"
              className={styles.success}
              onClick={handleValidateBet}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-circle-check"
                viewBox="0 0 24 24"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="12" cy="12" r="9" />
                <path d="M9 12l2 2l4 -4" />
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
            id: <span>{bet.id}</span>
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
            data de criação: <span>{getLocaleTimeString(bet.created_at)}</span>
          </li>

          {type === "pendingBet" && (
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
              token: <span>{bet.token}</span>
            </li>
          )}
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
            valor: <span>{formatter.format(bet.value)}</span>
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
            <span>{`${getAnimalName(bet.animal)} (${bet.animal})`}</span>
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
            nome: <span>{bet.name}</span>
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
            telefone: <span>{bet.phone}</span>
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
            conta bancária: <span>{bet.bank_account}</span>
          </li>
        </ul>
      </div>
    </>
  );
}
