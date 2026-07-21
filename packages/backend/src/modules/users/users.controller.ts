import type { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { toUserDTO } from "../../utils/mappers";
import { HttpError } from "../../utils/httpError";

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: req.body,
  });
  res.json({ user: toUserDTO(user) });
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, pageSize } = req.query as unknown as {
    page: number;
    pageSize: number;
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count(),
  ]);
  res.json({
    items: items.map(toUserDTO),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
});

export const updateUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.params.id === req.user!.id) {
      throw HttpError.badRequest("You cannot change your own role");
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: req.body.role },
    });
    res.json({ user: toUserDTO(user) });
  },
);
