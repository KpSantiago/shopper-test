/*
  Warnings:

  - Added the required column `customer_code` to the `measure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "measure" ADD COLUMN     "customer_code" TEXT NOT NULL;
