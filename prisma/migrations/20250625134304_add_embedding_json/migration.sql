/*
  Warnings:

  - You are about to alter the column `embedding` on the `problem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `problem` MODIFY `embedding` JSON NULL;
