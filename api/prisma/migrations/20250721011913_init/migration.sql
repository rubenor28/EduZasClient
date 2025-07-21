-- CreateTable
CREATE TABLE `Log` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('SYSTEM_ERROR', 'VALIDATION_ERROR', 'USER_ACTION', 'ADMIN_ACTION', 'DATA_MODIFICATION', 'SECURITY_EVENT', 'EXTERNAL_SERVICE') NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `stacktrace` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `user_id` BIGINT UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tuition` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `mid_name` VARCHAR(191) NULL,
    `father_lastname` VARCHAR(191) NOT NULL,
    `mother_lastname` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'PROFESSOR', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_tuition_key`(`tuition`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `id` VARCHAR(20) NOT NULL,
    `class_name` VARCHAR(100) NOT NULL,
    `subject` VARCHAR(100) NOT NULL,
    `section` VARCHAR(100) NOT NULL,
    `owner_id` BIGINT UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes_professors` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `class_id` VARCHAR(20) NULL,
    `professor_id` BIGINT UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes_studens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `class_id` VARCHAR(20) NULL,
    `student_id` BIGINT UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agenda_contacts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `agenda_owner_id` BIGINT UNSIGNED NULL,
    `contact_id` BIGINT UNSIGNED NULL,
    `alias` VARCHAR(40) NOT NULL,
    `tag` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_resources` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(40) NOT NULL,
    `content` JSON NOT NULL,
    `professor_id` BIGINT UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes_resources_link` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `classId` VARCHAR(20) NULL,
    `resource_id` BIGINT UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_tests` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(40) NOT NULL,
    `password` VARCHAR(25) NULL,
    `content` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes_tests_link` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `classId` VARCHAR(20) NULL,
    `test_id` BIGINT UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_professors` ADD CONSTRAINT `classes_professors_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_professors` ADD CONSTRAINT `classes_professors_professor_id_fkey` FOREIGN KEY (`professor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_studens` ADD CONSTRAINT `classes_studens_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_studens` ADD CONSTRAINT `classes_studens_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agenda_contacts` ADD CONSTRAINT `agenda_contacts_agenda_owner_id_fkey` FOREIGN KEY (`agenda_owner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agenda_contacts` ADD CONSTRAINT `agenda_contacts_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_resources` ADD CONSTRAINT `class_resources_professor_id_fkey` FOREIGN KEY (`professor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_resources_link` ADD CONSTRAINT `classes_resources_link_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_resources_link` ADD CONSTRAINT `classes_resources_link_resource_id_fkey` FOREIGN KEY (`resource_id`) REFERENCES `class_resources`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_tests_link` ADD CONSTRAINT `classes_tests_link_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_tests_link` ADD CONSTRAINT `classes_tests_link_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `class_tests`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
