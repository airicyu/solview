import { createContext, useContext } from "react";
import * as web3 from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import { programLabels } from "../data/programLabels";
import { transactionTagging } from "../utils/transactionTagging";

const connection = new web3.Connection(
  "https://solana-mainnet.rpc.extrnode.com",
  //   web3.clusterApiUrl("mainnet-beta"),
  "confirmed"
);

const Web3Context = createContext<Web3ContextType>({
  connection,
  programLabels,
  transactionTagging,
});

declare type Web3ContextType = {
  connection: Connection;
  programLabels: {
    program: { [key: string]: string };
    address: { [key: string]: string };
  };
  transactionTagging: (transaction: web3.ParsedTransactionWithMeta) => string;
};

const defaultContext = {
  connection,
  programLabels,
  transactionTagging,
};

export { Web3Context, defaultContext };
export type { Web3ContextType };
