import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.url(),
});

export type env = z.infer<typeof envSchema>;
