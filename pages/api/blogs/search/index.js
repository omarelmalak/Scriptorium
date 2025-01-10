// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { getUserId } from "../../../../utils";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { category, searchTerm, page = 1, limit = 10, scope } = req.query;

    console.log("limit: " + limit);
    console.log("SCOPE: ", scope);

    let userId = null;
    try {
      userId = getUserId(req);
    } catch (error) { }

    try {
      const categories = Array.isArray(category)
        ? category.map((cat) => cat.trim())
        : category
          ? category.split(",").map((cat) => cat.trim())
          : [];
      const fetchPromises = [];

      if (!categories.length) {
        const allResults = await fetch(
          `http://localhost:3000/api/blogs/search/all`,
          {
            method: "GET",
            headers: userId ? { "user-header": userId } : {},
          }
        );

        let data = await allResults.json();

        if (req.query.scope === "local") {
          console.log("ENTERING IF: Filtering for local blogs");
          const filteredResults = data.filter(blog => blog.authorId === userId);
          console.log("Filtered Results (local):", filteredResults);
          data = filteredResults;
        }

        console.log("Data:", data);
        const start = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const paginatedResults = data.slice(start, start + parseInt(limit, 10));

        console.log(
          `start: ${start}, start + limit: ${start + parseInt(limit, 10)}`
        );
        console.log("Paginated Results:", paginatedResults);

        const totalPages = Math.ceil(data.length / limit);
        console.log("total pages", totalPages);


        return res.status(allResults.status).json({
          blogs: paginatedResults,
          total: data.length,
          totalPages,
        });
      }

      console.log("THIS IS THE SCOPE: ", scope);

      categories.forEach((cat) => {
        let url;
        switch (cat) {
          case "title":
            url = `http://localhost:3000/api/blogs/search/title?searchTerm=${encodeURIComponent(
              searchTerm
            )}`;
            break;
          case "content":
            url = `http://localhost:3000/api/blogs/search/content?searchTerm=${encodeURIComponent(
              searchTerm
            )}`;
            break;
          case "tags":
            url = `http://localhost:3000/api/blogs/search/tags?searchTerm=${encodeURIComponent(
              searchTerm
            )}`;
            break;
          case "codes":
            url = `http://localhost:3000/api/blogs/search/codes?searchTerm=${encodeURIComponent(
              searchTerm
            )}`;
            break;
          default:
            return res.status(400).json({ error: "Invalid category" });
        }

        fetchPromises.push(
          fetch(url, {
            method: "GET",
            headers: userId ? { "user-header": userId } : {},
          })
        );
      });

      const results = await Promise.all(fetchPromises);

      const uniqueResultsMap = new Map();
      for (const result of results) {
        const data = await result.json();
        data.forEach((item) => {
          if (!uniqueResultsMap.has(item.id)) {
            uniqueResultsMap.set(item.id, item);
          }
        });
      }
      if (scope === "local") {
        console.log("ENTERING IF");
        for (const [id, blog] of uniqueResultsMap) {
          if (blog.authorId !== userId) {
            uniqueResultsMap.delete(id);

          }
        }
      }

      const uniqueResults = Array.from(uniqueResultsMap.values());

      const start = (page - 1) * limit;
      const paginatedResults = uniqueResults.slice(start, start + limit);

      const totalPages = Math.ceil(uniqueResults.length / limit);

      console.log("total pages", totalPages);

      return res.status(200).json({
        blogs: paginatedResults,
        total: uniqueResults.length,
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while searching" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
