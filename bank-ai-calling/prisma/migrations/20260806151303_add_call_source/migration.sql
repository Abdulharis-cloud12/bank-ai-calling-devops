-- CreateEnum
CREATE TYPE "CallSource" AS ENUM ('AI', 'MANUAL');

-- AlterTable
ALTER TABLE "calls" ADD COLUMN     "source" "CallSource" NOT NULL DEFAULT 'AI';
