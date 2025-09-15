/*
  Warnings:

  - You are about to drop the column `alamat` on the `Santri` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Santri" DROP COLUMN "alamat",
ADD COLUMN     "desa" TEXT,
ADD COLUMN     "kabupaten" TEXT,
ADD COLUMN     "kecamatan" TEXT,
ADD COLUMN     "provinsi" TEXT;
