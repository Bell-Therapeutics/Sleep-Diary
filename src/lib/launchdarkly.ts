import { init as initializeLDClient } from "launchdarkly-node-server-sdk";

const client = initializeLDClient(
  process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID!
);
const user = {
  key: "Belltherapeutics",
  anonymous: true,
};

let initialized = false;

export async function getFlagValue(flagKey: string): Promise<boolean> {
  if (!initialized) {
    await client.waitForInitialization();
    initialized = true;
  }
  return client.variation(flagKey, user, false);
}
