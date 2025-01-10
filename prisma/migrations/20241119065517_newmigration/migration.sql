-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePicture" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CodeTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "language" TEXT NOT NULL,
    "input" TEXT NOT NULL DEFAULT '',
    "parentId" INTEGER,
    CONSTRAINT "CodeTemplate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CodeTemplate_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CodeTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "blogId" INTEGER NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "explanation" TEXT NOT NULL,
    "parentId" INTEGER NOT NULL,
    "parentType" TEXT NOT NULL,
    CONSTRAINT "Report_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Blog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BlogCodeTemplates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogCodeTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogCodeTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "CodeTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BlogTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UpvotedBlogs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UpvotedBlogs_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UpvotedBlogs_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DownvotedBlogs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DownvotedBlogs_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DownvotedBlogs_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CodeTemplateTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CodeTemplateTags_A_fkey" FOREIGN KEY ("A") REFERENCES "CodeTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CodeTemplateTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UpvotedComments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UpvotedComments_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UpvotedComments_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DownvotedComments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DownvotedComments_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DownvotedComments_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_title_key" ON "Blog"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CodeTemplate_title_key" ON "CodeTemplate"("title");

-- CreateIndex
CREATE INDEX "CodeTemplate_parentId_idx" ON "CodeTemplate"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogCodeTemplates_AB_unique" ON "_BlogCodeTemplates"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogCodeTemplates_B_index" ON "_BlogCodeTemplates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogTags_AB_unique" ON "_BlogTags"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogTags_B_index" ON "_BlogTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UpvotedBlogs_AB_unique" ON "_UpvotedBlogs"("A", "B");

-- CreateIndex
CREATE INDEX "_UpvotedBlogs_B_index" ON "_UpvotedBlogs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DownvotedBlogs_AB_unique" ON "_DownvotedBlogs"("A", "B");

-- CreateIndex
CREATE INDEX "_DownvotedBlogs_B_index" ON "_DownvotedBlogs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CodeTemplateTags_AB_unique" ON "_CodeTemplateTags"("A", "B");

-- CreateIndex
CREATE INDEX "_CodeTemplateTags_B_index" ON "_CodeTemplateTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UpvotedComments_AB_unique" ON "_UpvotedComments"("A", "B");

-- CreateIndex
CREATE INDEX "_UpvotedComments_B_index" ON "_UpvotedComments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DownvotedComments_AB_unique" ON "_DownvotedComments"("A", "B");

-- CreateIndex
CREATE INDEX "_DownvotedComments_B_index" ON "_DownvotedComments"("B");
