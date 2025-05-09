import { init as initializeLDClient } from "launchdarkly-node-server-sdk";

const client = initializeLDClient("sdk-a286c77b-cf47-4ff8-940d-39bea7b9da33");
const user = {
  key: "anonymous-user",
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
