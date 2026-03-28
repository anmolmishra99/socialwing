import { NextResponse } from "next/server";
import { Contract, JsonRpcProvider, ZeroHash } from "ethers";
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
    const addr = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;
    if (!addr) return NextResponse.json({ error: "Contract address not set" }, { status: 500 });

    const contract = new Contract(addr, ABI, provider);

    const parsed = parseRecord(record);
    const local = computeRecordHash(parsed);
    const idh = computeRecordIdHash(id);
    const onchain = await contract.getRecordHash(idh);

    const isOnChain = !!onchain && onchain !== ZeroHash;
    const match = isOnChain && String(onchain).toLowerCase() === local.toLowerCase();

    await updateDoc(doc(db, "landRecord", id), {
      blockchain_synced: isOnChain,
      live_record_hash: local,
    });

    return NextResponse.json({ isOnChain, match, local, onchain });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Verify failed" }, { status: 500 });
  }
}