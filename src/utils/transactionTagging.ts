import * as web3 from "@solana/web3.js";
import { programLabels } from "../data/programLabels";

export const transactionTagging = (
  transaction: web3.ParsedTransactionWithMeta
) => {
  const ixs = transaction?.transaction?.message?.instructions;
  if (ixs) {
    const programNames = ixs
      .map((_) => _.programId.toString())
      .map((programId) => programLabels.program[programId] ?? programId);
    console.log(programNames);

    if (programNames.includes("Vote Program")) {
      return "Vote";
    }

    if (programNames.find((name) => name.startsWith("Jupiter Aggregator "))) {
      return "Jupiter";
    }

    if (programNames.includes("SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP")) {
      return "Sharky";
    }

    if (programNames.includes("Orca")) {
      return "Orca";
    }
  }

  return "Generic Transaction";
};
