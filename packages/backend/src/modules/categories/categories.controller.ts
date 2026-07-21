import type { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { toCategoryDTO } from "../../utils/mappers";
import { HttpError } from "../../utils/httpError";
import { slugify } from "./categories.validation";

export const listCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { questions: { where: { status: "APPROVED" } } } },
      },
    });
    res.json({ categories: categories.map(toCategoryDTO) });
  },
);

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id },
    include: {
      _count: { select: { questions: { where: { status: "APPROVED" } } } },
    },
  });
  if (!category) throw HttpError.notFound("Category not found");
  res.json({ category: toCategoryDTO(category) });
});

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, icon } = req.body;
    const slug = slugify(req.body.slug || name);

    const category = await prisma.category.create({
      data: { name, slug, description, icon },
    });
    res.status(201).json({ category: toCategoryDTO(category) });
  },
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, icon } = req.body;
    const slug = req.body.slug
      ? slugify(req.body.slug)
      : req.body.name
        ? slugify(req.body.name)
        : undefined;

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name, description, icon, slug },
    });
    res.json({ category: toCategoryDTO(category) });
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const questionCount = await prisma.question.count({
      where: { categoryId: req.params.id },
    });
    if (questionCount > 0) {
      throw HttpError.conflict(
        "Cannot delete a category that still has questions",
      );
    }
    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).send();
  },
);
