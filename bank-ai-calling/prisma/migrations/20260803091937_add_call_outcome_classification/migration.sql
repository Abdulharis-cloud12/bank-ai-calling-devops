-- CreateEnum
CREATE TYPE "CallOutcome" AS ENUM ('INTERESTED', 'FOLLOW_UP_REQUIRED', 'CALL_BACK_REQUESTED', 'NOT_INTERESTED', 'PRICE_OBJECTION', 'NEEDS_DISCUSSION', 'DECISION_PENDING', 'MEETING_REQUIRED', 'DEMO_REQUIRED', 'CONVERTED', 'NO_RESPONSE', 'WRONG_NUMBER', 'LOST');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'NONE');

-- AlterTable
ALTER TABLE "call_summaries" ADD COLUMN     "callOutcome" "CallOutcome",
ADD COLUMN     "followUpDate" TEXT,
ADD COLUMN     "keyObjection" TEXT,
ADD COLUMN     "nextAction" TEXT,
ADD COLUMN     "priority" "Priority";
