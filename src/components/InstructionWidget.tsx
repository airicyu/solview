import * as web3 from "@solana/web3.js";
import { useContext } from "react";
import { Web3Context } from "../contexts/web3Context";
import { Card } from "antd";
import { Collapse } from "antd";
const { Panel } = Collapse;

export const InstructionWidget = ({
  ix,
}: {
  ix: web3.ParsedInstruction | web3.PartiallyDecodedInstruction;
}) => {
  let web3Context = useContext(Web3Context);
  const programId = ix.programId.toString();

  const programName = web3Context.programLabels.program[programId] ?? programId;
  const isParsed = !!(ix as web3.ParsedInstruction).parsed;
  const type = (ix as web3.ParsedInstruction).parsed?.type;
  const info = (ix as web3.ParsedInstruction).parsed?.info;
  const data = (ix as web3.PartiallyDecodedInstruction).data;

  let body = null;
  if (isParsed) {
    body = (
      <div>
        data:{" "}
        <div style={{ border: "1px solid #999", width: 800 }}>
          <pre>{JSON.stringify(info, null, 2)}</pre>
        </div>
      </div>
    );
  } else {
    body = (
      <div>
        data: <div style={{ border: "1px solid #999", width: 800 }}>{data}</div>
      </div>
    );
  }
  return (
    <Collapse className="ix-card">
      <Panel
        key={1}
        header={
          <div>
            Program:<b> {programName}</b>{" "}
            {type && (
              <b>
                {"=>"} {type}
              </b>
            )}
          </div>
        }
      >
        {body}
      </Panel>
    </Collapse>
  );
};
