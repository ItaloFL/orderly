/*
  Warnings:

  - Added the required column `userEmail` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "imageUrl" TEXT NOT NULL;
