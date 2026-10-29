import { z } from 'zod';
import { categories, severities, environments, statuses } from '../models/Incident.js';
export const incidentSchema = z.object({ title: z.string().trim().min(3).max(120), description: z.string().trim().min(10).max(4000), service: z.string().trim().min(1).max(120), severity: z.enum(severities), environment: z.enum(environments), category: z.enum(categories).optional() });
export const incidentPatchSchema = z.object({ title: z.string().trim().min(3).max(120).optional(), description: z.string().trim().min(10).max(4000).optional(), status: z.enum(statuses).optional() }).refine((value) => Object.keys(value).length > 0);
