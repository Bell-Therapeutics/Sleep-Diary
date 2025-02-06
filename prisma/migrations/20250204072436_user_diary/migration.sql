-- CreateTable
CREATE TABLE `UserDiary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `yearMonth` VARCHAR(191) NOT NULL,
    `dates` JSON NOT NULL,

    UNIQUE INDEX `UserDiary_userId_yearMonth_key`(`userId`, `yearMonth`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
