import { z } from "zod"

export const blockChunkSchema = z.object({
  name: z.string(),
  code: z.string().optional(),
})

export type BlockCodeExample = z.infer<typeof blockChunkSchema>