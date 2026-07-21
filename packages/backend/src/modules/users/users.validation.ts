import { z } from "zod";
import { Role } from "@interdex/shared";

export const updateMeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(Role),
});

export const userIdParamSchema = z.object({ id: z.string().uuid() });
