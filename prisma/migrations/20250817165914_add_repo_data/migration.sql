-- CreateTable
CREATE TABLE "public"."RepoData" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nestJSGitRepo" TEXT,
    "nestJSDeployedServer" TEXT,
    "nestJSSwaggerUrl" TEXT,
    "nextJSGitRepo" TEXT,
    "nextJSDeployedServer" TEXT,
    "postgresDeployedServer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepoData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepoData_userId_key" ON "public"."RepoData"("userId");

-- AddForeignKey
ALTER TABLE "public"."RepoData" ADD CONSTRAINT "RepoData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
