-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tuition` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `mid_name` VARCHAR(191) NULL,
    `father_lastname` VARCHAR(191) NOT NULL,
    `mother_lastname` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_tuition_key`(`tuition`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
