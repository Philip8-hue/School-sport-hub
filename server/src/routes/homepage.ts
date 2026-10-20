import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { defaultHomepageContent, parseHomepageContent } from "../lib/homepage.js";

export const homepageRouter = Router();

homepageRouter.get("/", async (_request, response, next) => {
  try {
    const record = await prisma.homepageContent.findUnique({ where: { id: 1 } });
    response.json({ content: record ? parseHomepageContent(record.content) : defaultHomepageContent });
  } catch (error) {
    next(error);
  }
});
