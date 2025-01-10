-- DropIndex
DROP INDEX "CodeTemplate_title_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "explanation" TEXT NOT NULL,
    "parentId" INTEGER NOT NULL,
    "parentType" TEXT NOT NULL
);
INSERT INTO "new_Report" ("explanation", "id", "parentId", "parentType") SELECT "explanation", "id", "parentId", "parentType" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE INDEX "Report_parentId_parentType_idx" ON "Report"("parentId", "parentType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
