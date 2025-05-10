import {
  init as initializeLDClient,
  LDClient,
} from "launchdarkly-node-server-sdk";

let client: LDClient | null = null;
let initialized = false;

export async function getServerFlagValue(
  flagKey: string
): Promise<boolean | string> {
  try {
    if (!client) {
      client = initializeLDClient(process.env.LAUNCHDARKLY_SECRET_KEY!);
    }

    if (!initialized) {
      await client.waitForInitialization();
      initialized = true;
    }

    const user = {
      key: "anonymous",
      anonymous: true,
    };

    return client.variation(flagKey, user, false);
  } catch (error) {
    console.error("LaunchDarkly error:", error);
    return false;
  }
}
