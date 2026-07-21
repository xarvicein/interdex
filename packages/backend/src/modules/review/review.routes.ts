import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  idParamSchema,
  reviewDecisionSchema,
  reviewQueueQuerySchema,
} from "../questions/questions.validation";
import * as controller from "./review.controller";

export const reviewRouter = Router();

reviewRouter.use(authenticate, requireAdmin);

reviewRouter.get(
  "/questions",
  validate({ query: reviewQueueQuerySchema }),
  controller.listQuestionQueue,
);
reviewRouter.post(
  "/questions/:id/approve",
  validate({ params: idParamSchema, body: reviewDecisionSchema }),
  controller.decideQuestion("APPROVED"),
);
reviewRouter.post(
  "/questions/:id/reject",
  validate({ params: idParamSchema, body: reviewDecisionSchema }),
  controller.decideQuestion("REJECTED"),
);

reviewRouter.get(
  "/answers",
  validate({ query: reviewQueueQuerySchema }),
  controller.listAnswerQueue,
);
reviewRouter.post(
  "/answers/:id/approve",
  validate({ params: idParamSchema, body: reviewDecisionSchema }),
  controller.decideAnswer("APPROVED"),
);
reviewRouter.post(
  "/answers/:id/reject",
  validate({ params: idParamSchema, body: reviewDecisionSchema }),
  controller.decideAnswer("REJECTED"),
);
