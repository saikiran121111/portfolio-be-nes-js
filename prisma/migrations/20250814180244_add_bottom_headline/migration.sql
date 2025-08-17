-- CreateTable
CREATE TABLE "public"."BottomHeadline" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BottomHeadline_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."BottomHeadline" ADD CONSTRAINT "BottomHeadline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
