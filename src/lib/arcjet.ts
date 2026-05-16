import arcjet, {
  shield,
  detectBot,
  tokenBucket,
} from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),

    // ✅ FIXED: Added mandatory array defining which traffic blocks to drop
    detectBot({
      mode: "LIVE",
      deny: [], 
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 20,
    }),
  ],
});