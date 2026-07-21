import "dotenv/config";
import { PrismaClient, ReviewStatus, Role, AuthProvider } from "@prisma/client";
import { hashPassword } from "../../src/utils/password";
import { pythonSeed } from "./data/python";
import { sqlSeed } from "./data/sql";
import { typescriptSeed } from "./data/typescript";
import { javascriptSeed } from "./data/javascript";
import { reactSeed } from "./data/react";
import { systemDesignSeed } from "./data/system-design";
import type { CategorySeed } from "./types";

const prisma = new PrismaClient();

const categories: CategorySeed[] = [
  pythonSeed,
  sqlSeed,
  typescriptSeed,
  javascriptSeed,
  reactSeed,
  systemDesignSeed,
];

async function ensureSeedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@interdex.dev";
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      email,
      name: "InterDex Admin",
      passwordHash: await hashPassword(password),
      role: Role.ADMIN,
      authProvider: AuthProvider.LOCAL,
    },
  });
}

async function main() {
  const admin = await ensureSeedAdmin();
  console.log(`Seed admin ready: ${admin.email}`);

  let questionsCreated = 0;

  for (const categorySeed of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categorySeed.slug },
      update: {
        name: categorySeed.name,
        description: categorySeed.description,
        icon: categorySeed.icon,
      },
      create: {
        name: categorySeed.name,
        slug: categorySeed.slug,
        description: categorySeed.description,
        icon: categorySeed.icon,
      },
    });

    for (const q of categorySeed.questions) {
      const alreadyExists = await prisma.question.findFirst({
        where: { title: q.title, categoryId: category.id },
        select: { id: true },
      });
      if (alreadyExists) continue;

      await prisma.question.create({
        data: {
          title: q.title,
          prompt: q.prompt,
          difficulty: q.difficulty,
          tags: q.tags,
          categoryId: category.id,
          status: ReviewStatus.APPROVED,
          createdById: admin.id,
          reviewedById: admin.id,
          reviewedAt: new Date(),
          answers: {
            create: q.answers.map((a) => ({
              contentType: a.contentType,
              textContent: a.textContent,
              codeContent: a.codeContent,
              codeLanguage: a.codeLanguage,
              status: ReviewStatus.APPROVED,
              createdById: admin.id,
              reviewedById: admin.id,
              reviewedAt: new Date(),
            })),
          },
        },
      });
      questionsCreated++;
    }

    console.log(
      `Category "${categorySeed.name}": ${categorySeed.questions.length} questions processed`,
    );
  }

  console.log(`Done. ${questionsCreated} new questions created.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
