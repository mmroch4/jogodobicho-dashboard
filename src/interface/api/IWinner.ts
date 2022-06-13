import type { WinnerBet as IWinnerBet } from "@prisma/client";
import type { IAnimal } from "./IAnimal";

export type IWinner = IWinnerBet & {
  animalId: string;
  animal: IAnimal;
};
