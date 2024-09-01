-- CreateTable
CREATE TABLE "measures" (
    "measure_uuid" TEXT NOT NULL PRIMARY KEY,
    "image_url" TEXT NOT NULL,
    "measure_type" TEXT NOT NULL,
    "measure_datetime" DATETIME NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "measure_value" REAL NOT NULL,
    "customer_code" TEXT NOT NULL
);
