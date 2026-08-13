-- CreateTable
CREATE TABLE "Holding" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "shares" DOUBLE PRECISION NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
