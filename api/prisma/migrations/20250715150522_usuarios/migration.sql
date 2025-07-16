-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "tuition" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "first_name" TEXT NOT NULL,
    "mid_name" TEXT NOT NULL,
    "father_lastname" TEXT NOT NULL,
    "gender" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
