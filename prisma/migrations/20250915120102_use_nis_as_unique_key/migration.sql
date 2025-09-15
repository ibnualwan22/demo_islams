/*
  Warnings:

  - You are about to drop the column `apiId` on the `Santri` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Santri_apiId_key";

-- AlterTable
ALTER TABLE "public"."Santri" DROP COLUMN "apiId";
