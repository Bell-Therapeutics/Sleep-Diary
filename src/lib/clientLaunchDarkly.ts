import * as LDClient from "launchdarkly-js-client-sdk";

const context: LDClient.LDContext = {
  key: "Belltherapeutics",
};

export function getClientFlagValue(flagKey: string): Promise<boolean | string> {
  return new Promise((resolve, reject) => {
    try {
      const client = LDClient.initialize(
        process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID!,
        context
      );

      client.on("initialized", () => {
        const flagValue = client.variation(flagKey);
        console.log("Feature flag value:", flagValue);
        resolve(flagValue); // ✅ 여기서 resolve 해줌
      });

      client.on("failed", () => {
        console.error("LaunchDarkly initialization failed.");
        reject("LaunchDarkly initialization failed");
      });
    } catch (error) {
      console.error("Failed to initialize LaunchDarkly client:", error);
      reject(error);
    }
  });
}
