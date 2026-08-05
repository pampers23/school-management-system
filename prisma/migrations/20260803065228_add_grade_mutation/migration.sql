-- CreateTable
CREATE TABLE `GradeTransmutation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `initialFrom` DECIMAL(5, 2) NOT NULL,
    `initialTo` DECIMAL(5, 2) NOT NULL,
    `transmutatedGrade` INTEGER NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
