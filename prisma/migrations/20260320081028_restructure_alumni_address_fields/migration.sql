/*
  Warnings:

  - You are about to drop the column `alamatAsli` on the `Alumni` table. All the data in the column will be lost.
  - You are about to drop the column `alamatDomisili` on the `Alumni` table. All the data in the column will be lost.
  - You are about to drop the column `kabupaten` on the `Alumni` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Alumni" DROP COLUMN "alamatAsli",
DROP COLUMN "alamatDomisili",
DROP COLUMN "kabupaten",
ADD COLUMN     "desaAsli" TEXT,
ADD COLUMN     "desaDomisili" TEXT,
ADD COLUMN     "kabupatenAsli" TEXT,
ADD COLUMN     "kabupatenDomisili" TEXT,
ADD COLUMN     "kecamatanAsli" TEXT,
ADD COLUMN     "kecamatanDomisili" TEXT,
ADD COLUMN     "provinsiAsli" TEXT,
ADD COLUMN     "provinsiDomisili" TEXT;
