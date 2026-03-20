-- AlterTable
ALTER TABLE "public"."Alumni" ADD COLUMN     "detailAlamat" TEXT,
ADD COLUMN     "kabupaten" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
