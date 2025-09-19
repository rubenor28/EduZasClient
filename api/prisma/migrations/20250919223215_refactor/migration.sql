/*
  Warnings:

  - The primary key for the `classes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `classes` table. All the data in the column will be lost.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `notifications` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(20)`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `tuition` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `agenda_contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `class_resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `class_tests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes_professors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes_resources_link` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes_students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes_tests_link` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications_per_user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `class_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Made the column `owner_id` on table `classes` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `notification_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Made the column `class_id` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `agenda_contacts` DROP FOREIGN KEY `agenda_contacts_agenda_owner_id_fkey`;

-- DropForeignKey
ALTER TABLE `agenda_contacts` DROP FOREIGN KEY `agenda_contacts_contact_id_fkey`;

-- DropForeignKey
ALTER TABLE `answers` DROP FOREIGN KEY `answers_classTestLinkId_fkey`;

-- DropForeignKey
ALTER TABLE `answers` DROP FOREIGN KEY `answers_userId_fkey`;

-- DropForeignKey
ALTER TABLE `class_resources` DROP FOREIGN KEY `class_resources_professor_id_fkey`;

-- DropForeignKey
ALTER TABLE `class_tests` DROP FOREIGN KEY `class_tests_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `classes` DROP FOREIGN KEY `classes_owner_id_fkey`;

-- DropForeignKey
ALTER TABLE `classes_professors` DROP FOREIGN KEY `classes_professors_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `classes_professors` DROP FOREIGN KEY `classes_professors_professor_id_fkey`;

-- DropForeignKey
ALTER TABLE `classes_resources_link` DROP FOREIGN KEY `classes_resources_link_classId_fkey`;

-- DropForeignKey
ALTER TABLE `classes_resources_link` DROP FOREIGN KEY `classes_resources_link_resource_id_fkey`;

-- DropForeignKey
ALTER TABLE `classes_students` DROP FOREIGN KEY `classes_students_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `classes_students` DROP FOREIGN KEY `classes_students_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `classes_tests_link` DROP FOREIGN KEY `classes_tests_link_classId_fkey`;

-- DropForeignKey
ALTER TABLE `classes_tests_link` DROP FOREIGN KEY `classes_tests_link_test_id_fkey`;

-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `logs_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `notifications_per_user` DROP FOREIGN KEY `notifications_per_user_notification_id_fkey`;

-- DropForeignKey
ALTER TABLE `notifications_per_user` DROP FOREIGN KEY `notifications_per_user_user_id_fkey`;

-- DropIndex
DROP INDEX `classes_owner_id_fkey` ON `classes`;

-- DropIndex
DROP INDEX `notifications_class_id_fkey` ON `notifications`;

-- DropIndex
DROP INDEX `users_email_key` ON `users`;

-- DropIndex
DROP INDEX `users_tuition_key` ON `users`;

-- AlterTable
ALTER TABLE `classes` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `class_id` VARCHAR(20) NOT NULL,
    MODIFY `owner_id` BIGINT UNSIGNED NOT NULL,
    ADD PRIMARY KEY (`class_id`);

-- AlterTable
ALTER TABLE `notifications` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `notification_id` BIGINT UNSIGNED NOT NULL,
    MODIFY `title` VARCHAR(20) NOT NULL,
    MODIFY `class_id` VARCHAR(20) NOT NULL,
    ADD PRIMARY KEY (`notification_id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `gender`,
    DROP COLUMN `id`,
    DROP COLUMN `tuition`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`user_id`);

-- DropTable
DROP TABLE `agenda_contacts`;

-- DropTable
DROP TABLE `answers`;

-- DropTable
DROP TABLE `class_resources`;

-- DropTable
DROP TABLE `class_tests`;

-- DropTable
DROP TABLE `classes_professors`;

-- DropTable
DROP TABLE `classes_resources_link`;

-- DropTable
DROP TABLE `classes_students`;

-- DropTable
DROP TABLE `classes_tests_link`;

-- DropTable
DROP TABLE `logs`;

-- DropTable
DROP TABLE `notifications_per_user`;

-- CreateTable
CREATE TABLE `class_professors` (
    `class_id` VARCHAR(20) NOT NULL,
    `student_id` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`class_id`, `student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_students` (
    `class_id` VARCHAR(20) NOT NULL,
    `student_id` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`class_id`, `student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_per_user` (
    `notification_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `readed` BOOLEAN NOT NULL DEFAULT false,
    `modified_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`notification_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resources` (
    `resource_id` BIGINT UNSIGNED NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `title` VARCHAR(35) NOT NULL,
    `content` JSON NOT NULL,
    `professor_id` BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (`resource_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resources_per_class` (
    `class_id` VARCHAR(20) NOT NULL,
    `professor_id` BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (`class_id`, `professor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tests` (
    `test_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(35) NOT NULL,
    `content` JSON NOT NULL,
    `time_limit_minutes` INTEGER UNSIGNED NULL,
    `professor_id` BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (`test_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tests_per_class` (
    `visible` BOOLEAN NOT NULL DEFAULT false,
    `test_id` BIGINT UNSIGNED NOT NULL,
    `class_id` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`test_id`, `class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_professors` ADD CONSTRAINT `class_professors_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_professors` ADD CONSTRAINT `class_professors_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_students` ADD CONSTRAINT `class_students_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_students` ADD CONSTRAINT `class_students_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_per_user` ADD CONSTRAINT `notification_per_user_notification_id_fkey` FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`notification_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_per_user` ADD CONSTRAINT `notification_per_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resources` ADD CONSTRAINT `resources_professor_id_fkey` FOREIGN KEY (`professor_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tests` ADD CONSTRAINT `tests_professor_id_fkey` FOREIGN KEY (`professor_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
