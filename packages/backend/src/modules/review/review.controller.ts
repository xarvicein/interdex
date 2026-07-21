import type { Request, Response } from "express";
import { ReviewStatus } from "@interdex/shared";
import { prisma } from "../../db/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { toAnswerDTO, toQuestionDTO } from "../../utils/mappers";
import { HttpError } from "../../utils/httpError";
import type { Prisma } from "@prisma/client";

const questionInclude = {
  category: { select: { id: true, name: true, slug: true } },
  createdBy: { select: { id: true, name: true } },
  reviewedBy: { select: { id: true, name: true } },
  answers: {
    include: { createdBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" as const },
  },
} satisfies Prisma.QuestionInclude;

export const listQuestionQueue = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, page, pageSize } = req.query as unknown as {
      status: ReviewStatus;
      page: number;
      pageSize: number;
    };

    const where: Prisma.QuestionWhereInput = { status };
    const [items, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: questionInclude,
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.question.count({ where }),
    ]);

    res.json({
      items: items.map(toQuestionDTO),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  },
);

export const decideQuestion = (decision: "APPROVED" | "REJECTED") =>
  asyncHandler(async (req: Request, res: Response) => {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });
    if (!question) throw HttpError.notFound("Question not found");
    if (question.status !== ReviewStatus.PENDING) {
      throw HttpError.conflict("Question has already been reviewed");
    }

    const { note } = req.body as { note?: string };

    const updated = await prisma.$transaction(async (tx) => {
      await tx.question.update({
        where: { id: question.id },
        data: {
          status: decision,
          reviewedById: req.user!.id,
          reviewNote: note,
          reviewedAt: new Date(),
        },
      });

      // Answers submitted alongside the question inherit its decision —
      // they were reviewed as one unit.
      await tx.answer.updateMany({
        where: { questionId: question.id, status: ReviewStatus.PENDING },
        data: {
          status: decision,
          reviewedById: req.user!.id,
          reviewedAt: new Date(),
        },
      });

      return tx.question.findUniqueOrThrow({
        where: { id: question.id },
        include: questionInclude,
      });
    });

    res.json({ question: toQuestionDTO(updated) });
  });

export const listAnswerQueue = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, page, pageSize } = req.query as unknown as {
      status: ReviewStatus;
      page: number;
      pageSize: number;
    };

    const where: Prisma.AnswerWhereInput = { status };
    const [items, total] = await Promise.all([
      prisma.answer.findMany({
        where,
        include: {
          createdBy: { select: { id: true, name: true } },
          question: { select: { id: true, title: true, status: true } },
        },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.answer.count({ where }),
    ]);

    res.json({
      items: items.map((a) => ({ ...toAnswerDTO(a), question: a.question })),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  },
);

export const decideAnswer = (decision: "APPROVED" | "REJECTED") =>
  asyncHandler(async (req: Request, res: Response) => {
    const answer = await prisma.answer.findUnique({
      where: { id: req.params.id },
    });
    if (!answer) throw HttpError.notFound("Answer not found");
    if (answer.status !== ReviewStatus.PENDING) {
      throw HttpError.conflict("Answer has already been reviewed");
    }

    const { note } = req.body as { note?: string };

    const updated = await prisma.answer.update({
      where: { id: answer.id },
      data: {
        status: decision,
        reviewedById: req.user!.id,
        reviewNote: note,
        reviewedAt: new Date(),
      },
      include: { createdBy: { select: { id: true, name: true } } },
    });

    res.json({ answer: toAnswerDTO(updated) });
  });
