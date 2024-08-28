import { createPublicClient, createWalletClient, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import { RelayerClient } from "@ethereum-tag-service/sdk-core";

// Generate private key and Tagger account only once
const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);
const accountAddress = account.address;

// Initialize viemClients only once
const viemClients = {
  public: createPublicClient({ chain: arbitrumSepolia, transport: http() }),
  wallet: createWalletClient({
    account,
    chain: arbitrumSepolia,
    transport: http(),
  }),
};

export async function runDemo(): Promise<{ result: string; link?: string }> {
  const accountBalance = await viemClients.public.getBalance({
    address: accountAddress,
  });

  if (accountBalance === 0n) {
    return {
      result: `Please send .0002 Arbitrum Sepolia ETH to the following address: ${accountAddress} then click 'Run Demo' again.`,
    };
  }

  const client = new RelayerClient({
    chainId: arbitrumSepolia.id,
    publicClient: viemClients.public,
    walletClient: viemClients.wallet,
    relayerAddress: "0xa01c9cb373c5e29934b92e5afa6a78e3d590340b", // ETS Relayer address
  });

  try {
    const taggingRecord = await client.createTaggingRecord(
      ["#rainbow", "#unicorn"], // Edit to your hashtags
      "https://uniswap.com", // Edit to your URL
      "Discovery" // Edit to your record type
    );

    const link = `https://app.ets.xyz/explore/tagging-records/${taggingRecord.taggingRecordId}`;

    return {
      result: `Tagging record created: ${JSON.stringify(
        taggingRecord,
        null,
        2
      )}`,
      link: link,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        result: `Error creating tagging record: ${error.message}`,
      };
    }
    return {
      result: `An unexpected error occurred: ${String(error)}`,
    };
  }
}
