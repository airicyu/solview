import * as web3 from "@solana/web3.js";
import { InstructionWidget } from "./InstructionWidget";
import { Card } from "antd";
import { Web3Context } from "../contexts/web3Context";
import { useContext } from "react";

export const TransaciotnWidget = ({
  hash,
  transaction,
}: {
  hash: string;
  transaction: web3.ParsedTransactionWithMeta;
}) => {
  let web3Context = useContext(Web3Context);

  const ixs = transaction?.transaction?.message?.instructions;
  if (!ixs) {
    return <Card className="trx-card">Can't load trx data</Card>;
  }
  const tag = web3Context.transactionTagging(transaction);
  return (
    <Card className="trx-card">
      <h2>{tag}</h2>
      trx hash: {hash}
      <div className="verticle-space"></div>
      {ixs.map((ix, i) => (
        <div key={i}>
          ix: {i}
          <InstructionWidget ix={ix}></InstructionWidget>
        </div>
      ))}
    </Card>
  );
};
