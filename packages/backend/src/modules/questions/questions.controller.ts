import type { Request, Response } from "express";
import { Difficulty, ReviewStatus, Role } from "@interdex/shared";
import { prisma } from "../../db/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { toQuestionDTO } from "../../utils/mappers";
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

function isOwnerOrAdmin(req: Request, createdById: string) {
  return req.user?.id === createdById || req.user?.role === Role.ADMIN;
}

export const listQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const { category, difficulty, tag, search, page, pageSize } =
      req.query as unknown as {
        category?: string;
        difficulty?: Difficulty;
        tag?: string;
        search?: string;
        page: number;
        pageSize: number;
      };

    const where: Prisma.QuestionWhereInput = { status: ReviewStatus.APPROVED };

    if (category) {
      where.category = { OR: [{ id: category }, { slug: category }] };
    }
    if (difficulty) where.difficulty = difficulty;
    if (tag) where.tags = { has: tag };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { prompt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: questionInclude,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.question.count({ where }),
    ]);

    // Public listing should never leak still-pending answers to a question
    // that already has some approved ones (e.g. a fresh alt-answer submission).
    const filtered = items.map((q) => ({
      ...q,
      answers: q.answers.filter((a) => a.status === ReviewStatus.APPROVED),
    }));

    res.json({
      items: filtered.map(toQuestionDTO),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  },
);

export const myQuestions = asyncHandler(async (req: Request, res: Response) => {
  const { page, pageSize } = req.query as unknown as {
    page: number;
    pageSize: number;
  };

  const where: Prisma.QuestionWhereInput = { createdById: req.user!.id };

  const [items, total] = await Promise.all([
    prisma.question.findMany({
      where,
      include: questionInclude,
      orderBy: { createdAt: "desc" },
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
});

export const getQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = await prisma.question.findUnique({
    where: { id: req.params.id },
    include: questionInclude,
  });
  if (!question) throw HttpError.notFound("Question not found");

  const viewerCanSeeUnapproved = isOwnerOrAdmin(req, question.createdById);
  if (question.status !== ReviewStatus.APPROVED && !viewerCanSeeUnapproved) {
    throw HttpError.notFound("Question not found");
  }

  const answers = question.answers.filter(
    (a) => a.status === ReviewStatus.APPROVED || viewerCanSeeUnapproved,
  );

  res.json({ question: toQuestionDTO({ ...question, answers }) });
});

export const createQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, prompt, categoryId, difficulty, tags, answers } = req.body;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) throw HttpError.badRequest("Unknown categoryId");

    const question = await prisma.question.create({
      data: {
        title,
        prompt,
        categoryId,
        difficulty,
        tags,
        createdById: req.user!.id,
        status: ReviewStatus.PENDING,
        answers: {
          create: answers.map((a: (typeof answers)[number]) => ({
            contentType: a.contentType,
            textContent: a.textContent,
            codeContent: a.codeContent,
            codeLanguage: a.codeLanguage,
            createdById: req.user!.id,
            status: ReviewStatus.PENDING,
          })),
        },
      },
      include: questionInclude,
    });

    res.status(201).json({ question: toQuestionDTO(question) });
  },
);
