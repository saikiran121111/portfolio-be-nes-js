ALTER TABLE "public"."Project"
ADD COLUMN "projectUrl" TEXT,
ADD COLUMN "type" TEXT,
ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;
