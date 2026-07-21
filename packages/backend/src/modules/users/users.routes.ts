import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  listUsersQuerySchema,
  updateMeSchema,
  updateUserRoleSchema,
  userIdParamSchema,
} from "./users.validation";
import * as controller from "./users.controller";

export const usersRouter = Router();

usersRouter.patch(
  "/me",
  authenticate,
  validate({ body: updateMeSchema }),
  controller.updateMe,
);

usersRouter.get(
  "/",
  authenticate,
  requireAdmin,
  validate({ query: listUsersQuerySchema }),
  controller.listUsers,
);
usersRouter.patch(
  "/:id/role",
  authenticate,
  requireAdmin,
  validate({ params: userIdParamSchema, body: updateUserRoleSchema }),
  controller.updateUserRole,
);
