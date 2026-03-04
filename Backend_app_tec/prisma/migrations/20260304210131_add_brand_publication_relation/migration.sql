-- Delete publications whose brandId is not a valid UUID referencing Brand.id
-- (test data with names like "Apple" instead of real UUIDs)
DELETE FROM "Publication"
WHERE "brandId" NOT IN (SELECT "id" FROM "Brand");

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
