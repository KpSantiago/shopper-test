/*
  Warnings:

  - You are about to drop the `measure` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "measure";

-- CreateTable
CREATE TABLE "measures" (
    "measure_uuid" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "measure_type" "MeasureType" NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "measure_value" DOUBLE PRECISION NOT NULL,
    "customer_code" TEXT NOT NULL,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("measure_uuid")
);
