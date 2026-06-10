import { z } from 'zod';

export const nodeFormSchema = z.object({
  id: z.string().optional(),
  nodeId: z.string(),
  label: z.string().min(1, "Process name is required"),
  executionProcess: z.string().min(1, "Execution process is required"),
  nextProcess: z.array(z.string()).default([]),
  previousProcess: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string()
  }).nullable().default(null),
  finalProcess: z.string().optional().default(""),
  type: z.enum(['start', 'process', 'input', 'decision']),
  description: z.string().optional().default("")
});

export type NodeFormData = z.infer<typeof nodeFormSchema>;