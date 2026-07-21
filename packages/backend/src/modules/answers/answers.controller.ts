import type { Request, Response } from "express";
import { ReviewStatus } from "@interdex/shared";
import { prisma } from "../../db/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { toAnswerDTO } from "../../utils/mappers";
import { HttpError } from "../../utils/httpError";

// Lets a signed-in user propose an additional answer to a question that's
// already public. The new answer starts PENDING and only appears once an
// admin approves it — it never mutates the question's own review status.
export const addAnswerToQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });
    if (!question || question.status !== ReviewStatus.APPROVED) {
      throw HttpError.notFound("Question not found");
    }

    const { contentType, textContent, codeContent, codeLanguage } = req.body;

    const answer = await prisma.answer.create({
      data: {
        questionId: question.id,
        contentType,
        textContent,
        codeContent,
        codeLanguage,
        createdById: req.user!.id,
        status: ReviewStatus.PENDING,
      },
      include: { createdBy: { select: { id: true, name: true } } },
    });

    res.status(201).json({ answer: toAnswerDTO(answer) });
  },
);
