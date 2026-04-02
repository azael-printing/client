-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('PICKUP', 'DELIVERY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'CREDIT');

-- CreateEnum
CREATE TYPE "PipelineStatus" AS ENUM ('NEW_REQUEST', 'IN_DESIGN', 'IN_PRODUCTION', 'DONE', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "jobNo" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "machine" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "description" TEXT,
    "qty" DOUBLE PRECISION NOT NULL,
    "unitType" TEXT NOT NULL,
    "designerRequired" BOOLEAN NOT NULL DEFAULT false,
    "urgency" "UrgencyLevel" NOT NULL DEFAULT 'NORMAL',
    "deliveryDate" TIMESTAMP(3),
    "deliveryTime" TEXT,
    "deliveryType" "DeliveryType" NOT NULL DEFAULT 'PICKUP',
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "vatEnabled" BOOLEAN NOT NULL DEFAULT true,
    "vatAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "depositAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remainingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "PipelineStatus" NOT NULL DEFAULT 'NEW_REQUEST',

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_jobNo_key" ON "Job"("jobNo");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
