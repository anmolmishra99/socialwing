import { NextResponse } from "next/server";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { db } from "@/app/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { parseRecord } from "@/utils/recordParser";
import { computeRecordHash, computeRecordIdHash } from "@/components/dashboard/OfficerDashboard/BlockChainSection/hashing";

const ABI = [
  "function syncRecord(bytes32 id, bytes32 hash) external",
  "function getRecordHash(bytes32 id) view returns (bytes32)",
  "event RecordSynced(bytes32 indexed id, bytes32 hash, address byUser, uint time)",
];

function getProvider() {
  const url = process.env.BLOCKCHAIN_RPC_URL || "https://rpc-amoy.polygon.technology";
  const chainId = process.env.BLOCKCHAIN_CHAIN_ID ? parseInt(process.env.BLOCKCHAIN_CHAIN_ID, 10) : undefined;
  return chainId ? new JsonRpcProvider(url, { chainId, name: process.env.BLOCKCHAIN_NETWORK || "custom" }) : new JsonRpcProvider(url);
}

export async function POST(req) {
  try {
    const { id, record } = await req.json();
    if (!id || !record) return NextResponse.json({ error: "Missing id or record" }, { status: 400 });

    const provider = getProvider();
    const pk = process.env.BLOCKCHAIN_PRIVATE_KEY;
    const addr = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;
    if (!pk) return NextResponse.json({ error: "Private key not set" }, { status: 500 });
    if (!addr) return NextResponse.json({ error: "Contract address not set" }, { status: 500 });

    const signer = new Wallet(pk, provider);
    const contract = new Contract(addr, ABI, signer);

    const parsed = parseRecord(record);
    const hash = computeRecordHash(parsed);
    const idh = computeRecordIdHash(id);

    const tx = await contract.syncRecord(idh, hash);
    const rcpt = await tx.wait();

    await updateDoc(doc(db, "landRecord", id), {
      blockchain_synced: true,
      blockchain_tx_hash: tx.hash,
      blockchain_contract_address: addr,
      blockchain_onchain_hash: hash,
      blockchain_last_synced_at: new Date(),
      live_record_hash: hash,
    });

    return NextResponse.json({ txHash: tx.hash, receiptStatus: rcpt?.status, hash, idHash: idh });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Sync failed" }, { status: 500 });
  }
}