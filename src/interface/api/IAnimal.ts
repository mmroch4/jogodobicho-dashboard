import type { WinnerAnimal as IWinnerAnimal } from "@prisma/client";
import type { IWinner } from "./IWinner";

export type IAnimal = IWinnerAnimal & {
  winners: IWinner[];
};
