/*
  Warnings:

  - The primary key for the `measure` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `measure_id` on the `measure` table. All the data in the column will be lost.
  - The required column `measure_uuid` was added to the `measure` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "measure" DROP CONSTRAINT "measure_pkey",
DROP COLUMN "measure_id",
ADD COLUMN     "measure_uuid" TEXT NOT NULL,
ADD CONSTRAINT "measure_pkey" PRIMARY KEY ("measure_uuid");
