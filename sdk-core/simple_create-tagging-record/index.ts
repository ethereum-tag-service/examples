import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import { RelayerClient } from "@ethereum-tag-service/sdk-core";

const account = privateKeyToAccount("0x..."); // Your private key here

const clients = {
  public: createPublicClient({ chain: arbitrumSepolia, transport: http() }),
  wallet: createWalletClient({
    account,
    chain: arbitrumSepolia,
    transport: http(),
  }),
};

const client = new RelayerClient({
  chainId: arbitrumSepolia.id,
  publicClient: clients.public,
  walletClient: clients.wallet,
  relayerAddress: "0xa01c9cb373c5e29934b92e5afa6a78e3d590340b",
});

client
  .createTaggingRecord(
    ["#rainbow", "#unicorn", "#uniswap"],
    "https://uniswap.org",
    "Demo"
  )
  .then((result) => console.log("Tagging record created:", result))
  .catch((error) => console.error("Error creating tagging record:", error));
