/*
  Warnings:

  - The values [p] on the enum `VisitStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VisitStatus_new" AS ENUM ('u', 'a', 'v', 'f', 'fu', 'fc', 'dnv', 'pr');
ALTER TABLE "Visit" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Visit" ALTER COLUMN "status" TYPE "VisitStatus_new" USING ("status"::text::"VisitStatus_new");
ALTER TYPE "VisitStatus" RENAME TO "VisitStatus_old";
ALTER TYPE "VisitStatus_new" RENAME TO "VisitStatus";
DROP TYPE "VisitStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "updatedBy" TEXT,
ALTER COLUMN "status" DROP DEFAULT;
