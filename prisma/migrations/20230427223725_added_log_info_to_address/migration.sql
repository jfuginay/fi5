/*
  Warnings:

  - You are about to drop the column `updatedBy` on the `Visit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "attendance" TEXT,
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "interested" BOOLEAN,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "prayerRequest" TEXT,
ADD COLUMN     "status" "VisitStatus" NOT NULL DEFAULT 'u',
ADD COLUMN     "updatedBy" TEXT DEFAULT 'SYSTEM';

-- AlterTable
ALTER TABLE "Visit" DROP COLUMN "updatedBy";
