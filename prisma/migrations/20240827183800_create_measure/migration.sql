-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "measure" (
    "measure_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "measure_type" "MeasureType" NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,

    CONSTRAINT "measure_pkey" PRIMARY KEY ("measure_id")
);
