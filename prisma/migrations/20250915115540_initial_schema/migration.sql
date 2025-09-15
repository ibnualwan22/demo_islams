-- CreateTable
CREATE TABLE "public"."Santri" (
    "id" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "asrama" TEXT,
    "alamat" TEXT,
    "namaAyah" TEXT,
    "namaIbu" TEXT,
    "noHpOrangTua" TEXT,
    "kelasFormal" TEXT,
    "kelasNgaji" TEXT,
    "ttl" TEXT,
    "tahunMasuk" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Santri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Alumni" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamatAsli" TEXT,
    "alamatDomisili" TEXT,
    "tahunMasuk" INTEGER,
    "tahunKeluar" INTEGER,
    "angkatanAmtsilati" INTEGER,
    "noHp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alumni_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Santri_apiId_key" ON "public"."Santri"("apiId");

-- CreateIndex
CREATE UNIQUE INDEX "Santri_nis_key" ON "public"."Santri"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_noHp_key" ON "public"."Alumni"("noHp");
