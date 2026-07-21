import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  categoryParamsSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./categories.validation";
import * as controller from "./categories.controller";

export const categoriesRouter = Router();

categoriesRouter.get("/", controller.listCategories);
categoriesRouter.get(
  "/:id",
  validate({ params: categoryParamsSchema }),
  controller.getCategory,
);

categoriesRouter.post(
  "/",
  authenticate,
  requireAdmin,
  validate({ body: createCategorySchema }),
  controller.createCategory,
);
categoriesRouter.patch(
  "/:id",
  authenticate,
  requireAdmin,
  validate({ params: categoryParamsSchema, body: updateCategorySchema }),
  controller.updateCategory,
);
categoriesRouter.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validate({ params: categoryParamsSchema }),
  controller.deleteCategory,
);
