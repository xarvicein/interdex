import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  addAnswerSchema,
  createQuestionSchema,
  idParamSchema,
  questionListQuerySchema,
  reviewQueueQuerySchema,
} from "./questions.validation";
import * as controller from "./questions.controller";
import { addAnswerToQuestion } from "../answers/answers.controller";

export const questionsRouter = Router();

questionsRouter.get(
  "/",
  validate({ query: questionListQuerySchema }),
  controller.listQuestions,
);
questionsRouter.get(
  "/mine",
  authenticate,
  validate({ query: reviewQueueQuerySchema.omit({ status: true }) }),
  controller.myQuestions,
);
questionsRouter.get(
  "/:id",
  optionalAuthenticate,
  validate({ params: idParamSchema }),
  controller.getQuestion,
);

questionsRouter.post(
  "/",
  authenticate,
  validate({ body: createQuestionSchema }),
  controller.createQuestion,
);

questionsRouter.post(
  "/:id/answers",
  authenticate,
  validate({ params: idParamSchema, body: addAnswerSchema }),
  addAnswerToQuestion,
);
