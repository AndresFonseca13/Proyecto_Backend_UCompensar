-- AlterTable: add name column with a temporary default for existing rows
ALTER TABLE "Publication" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';

-- Remove the default so future inserts require the value explicitly
ALTER TABLE "Publication" ALTER COLUMN "name" DROP DEFAULT;
