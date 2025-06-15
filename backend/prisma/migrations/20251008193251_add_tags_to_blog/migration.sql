-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

