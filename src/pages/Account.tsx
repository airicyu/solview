import { useEffect, useContext, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import * as web3 from "@solana/web3.js";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Web3Context } from "../contexts/web3Context";
import { Card, Button } from "antd";
import { InstructionWidget } from "../components/InstructionWidget";
import { TransaciotnWidget } from "../components/TransactionWidget";
import { Spin } from "antd";

export const Account = (props: any) => {
  let { accountAddress } = useParams();
  let web3Context = useContext(Web3Context);
  let connection = web3Context.connection;

  let [transactions, setTransactions] = useState<
    (web3.ParsedTransactionWithMeta & { hash: string })[]
  >([]);

  let [lastLoadedTrxHash, setLastLoadedTrxHash] = useState<string | null>(null);

  let [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (accountAddress) {
        setIsLoading(true);
        try {
          const trxHashes = (
            await connection.getSignaturesForAddress(
              new PublicKey(accountAddress),
              {
                //before?: TransactionSignature;
                limit: 10,
              }
            )
          ).map((payload) => payload.signature);

          const trxes = (
            await connection.getParsedTransactions(trxHashes, {
              maxSupportedTransactionVersion: 0,
            })
          ).map((trx, i) => {
            return Object.assign({}, trx, { hash: trxHashes[i] });
          });
          if (trxes) {
            setTransactions(trxes);
            const hashes = trxes.map((_) => _.hash).filter((_) => !!_);
            if (hashes[hashes.length - 1]) {
              setLastLoadedTrxHash(hashes[hashes.length - 1]);
            }
          }
          console.log(trxes);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [accountAddress, connection]);

  const loadMoreTransactions = useCallback(() => {
    (async () => {
      if (accountAddress) {
        setIsLoading(true);
        try {
          const trxHashes = (
            await connection.getSignaturesForAddress(
              new PublicKey(accountAddress),
              {
                before: lastLoadedTrxHash ?? undefined,
                limit: 10,
              }
            )
          ).map((payload) => payload.signature);

          const trxes = (
            await connection.getParsedTransactions(trxHashes, {
              maxSupportedTransactionVersion: 0,
            })
          ).map((trx, i) => {
            return Object.assign({}, trx, { hash: trxHashes[i] });
          });

          if (trxes) {
            setTransactions([...transactions, ...trxes]);
            const hashes = trxes.map((_) => _.hash).filter((_) => !!_);
            if (hashes[hashes.length - 1]) {
              setLastLoadedTrxHash(hashes[hashes.length - 1]);
            }
          }
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [accountAddress, connection, lastLoadedTrxHash, transactions]);

  return (
    <>
      <Spin spinning={isLoading} />
      <Card
        title={
          <div>
            Address: <h2>{accountAddress}</h2>
          </div>
        }
      >
        <h1>Transactions</h1>
        <hr />
        <div>
          {transactions.map((transaction: any, i: number) => {
            return (
              <div key={i}>
                <TransaciotnWidget
                  hash={transaction.hash}
                  transaction={transaction}
                ></TransaciotnWidget>
                <div className="vertical-space"></div>
              </div>
            );
          })}
        </div>
        <Button
          type="primary"
          onClick={loadMoreTransactions}
          loading={isLoading}
        >
          Load more Transactions ...
        </Button>
      </Card>
    </>
  );
};
