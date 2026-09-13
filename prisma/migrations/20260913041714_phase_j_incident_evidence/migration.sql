/*
  Warnings:

  - You are about to drop the `Evidence` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Evidence" DROP CONSTRAINT "Evidence_incidentId_fkey";

-- AlterTable
ALTER TABLE "CyberEvent" ADD COLUMN     "incidentId" TEXT;

-- DropTable
DROP TABLE "Evidence";

-- AddForeignKey
ALTER TABLE "CyberEvent" ADD CONSTRAINT "CyberEvent_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE SET NULL ON UPDATE CASCADE;
