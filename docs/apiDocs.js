// API/Documentation for the User Routes


/**
 * @api {POST} /api/users/login User Login
 * @apiName LoginUser
 * @apiGroup Users
 * @apiDescription Authenticates a user with their username and password, returning an access and refresh token upon successful login.
 *
 * @apiParam {String} username The username of the user attempting to log in.
 * @apiParam {String} password The password of the user.
 * 
 * @apiSuccess {String} accessToken The JWT access token for the authenticated user, valid for 25 minutes.
 * @apiSuccess {String} refreshToken The JWT refresh token for the authenticated user, valid for 2 hours.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "accessToken": "eyJhbGciOiJIUzI1...",
 *       "refreshToken": "eyJhbGciOiJIUzI1..."
 *     }
 *
 * @apiError {String} error Username does not exist in Prisma DB.
 * @apiErrorExample {json} Username Not Found Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Username does not exist in Prisma DB"
 *     }
 *
 * @apiError {String} error Password does not match in Prisma DB.
 * @apiErrorExample {json} Password Mismatch Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Password does not match in Prisma DB"
 *     }
 */





/**
 * @api {POST} /api/users/refresh Refresh Access Token
 * @apiName RefreshAccessToken
 * @apiGroup Users
 * @apiDescription Generates a new access token using a valid refresh token. This is used to extend the session without requiring the user to re-authenticate.
 *
 * @apiParam {String} refreshToken The refresh token issued during login.
 * 
 * @apiSuccess {String} accessToken The new JWT access token for the user, valid for 5 minutes.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "accessToken": "eyJhbGciOiJIUzI1..."
 *     }
 *
 * @apiError {String} message No refresh token passed.
 * @apiErrorExample {json} Missing Token Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "No refresh token passed"
 *     }
 * 
 * @apiError {String} message Invalid token.
 * @apiErrorExample {json} Invalid Token Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Invalid token"
 *     }
 * 
 * @apiError {String} message Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "message": "Method not allowed"
 *     }
 */


/**
 * @api {POST} /api/users/register Register New User
 * @apiName RegisterUser
 * @apiGroup Users
 * @apiDescription Registers a new user with the provided details, storing the user information in the database and hashing the password for security.
 *
 * @apiParam {String} username The unique username of the new user.
 * @apiParam {String} password The password for the user, which will be hashed before storage.
 * @apiParam {String} firstName The first name of the user.
 * @apiParam {String} lastName The last name of the user.
 * @apiParam {String} email The email address of the user, must be in valid format.
 * @apiParam {String} phoneNumber The phone number of the user.
 * 
 * @apiSuccess {Object} user The created user object with details (excluding password).
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "user": {
 *         "id": 1,
 *         "username": "johndoe",
 *         "firstName": "John",
 *         "lastName": "Doe",
 *         "email": "johndoe@example.com",
 *         "phoneNumber": "1234567890",
 *         "profilePicture": "../../../assets/images/default_avatar.png",
 *         "role": "USER"
 *       }
 *     }
 *
 * @apiError {String} error Invalid email format.
 * @apiErrorExample {json} Invalid Email Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Invalid email format"
 *     }
 *
 * @apiError {String} error Username or email already exists.
 * @apiErrorExample {json} Duplicate User Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Username or email already exists"
 *     }
 *
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */







// API/Documentation for the blogs Routes

/**
 * @api {POST} /api/blogs/create Create New Blog Post
 * @apiName CreateBlogPost
 * @apiGroup Blogs
 * @apiDescription Creates a new blog post with the specified title, description, tags, and code references. Requires authentication.
 *
 * @apiParam {String} title The title of the blog post.
 * @apiParam {String} description The content of the blog post.
 * @apiParam {Number[]} tagIds An array of tag IDs to associate with the blog post.
 * @apiParam {Number[]} codeIds An array of code IDs to associate with the blog post.
 * 
 * @apiSuccess {Object} blog The newly created blog post object, including details like title, description, author ID, tags, and codes.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "blog": {
 *         "id": 1,
 *         "title": "Sample Blog Title",
 *         "description": "This is the content of the blog post.",
 *         "authorId": 123,
 *         "tags": [{ "id": 1 }, { "id": 2 }],
 *         "codes": [{ "id": 10 }, { "id": 11 }]
 *       }
 *     }
 *
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 * 
 * @apiError {String} error Title and description are required.
 * @apiErrorExample {json} Missing Fields Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Title and description are required"
 *     }
 * 
 * @apiError {String} error An error occurred while creating the blog.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while creating the blog"
 *     }
 *
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */



/**
 * @api {GET} /api/blogs/:id Get Blog Post by ID
 * @apiName GetBlogPostById
 * @apiGroup Blogs
 * @apiDescription Retrieves a blog post by its ID, including its comments, tags, and associated code templates, with pagination support for comments, tags, and code references.
 *
 * @apiParam {Number} id The ID of the blog post to retrieve.
 * @apiParam {Number} [page=1] The page number for pagination of comments.
 * @apiParam {Number} [limit=10] The number of comments, tags, or code references per page.
 * 
 * @apiSuccess {Object} blog The blog post object with details including comments, tags, and codes.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "blog": {
 *         "id": 1,
 *         "title": "Sample Blog Title",
 *         "description": "Blog content",
 *         "authorId": 123,
 *         "hidden": false,
 *         "comments": [{ "id": 1, "content": "Comment text" }],
 *         "tags": [{ "id": 1, "name": "tag1" }],
 *         "codes": [{ "id": 1, "name": "code1" }]
 *       }
 *     }
 *
 * @apiError {String} error Blog not found.
 * @apiErrorExample {json} Blog Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Blog not found"
 *     }
 * 
 * @apiError {String} error Forbidden: This blog is hidden.
 * @apiErrorExample {json} Forbidden Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "Forbidden: This blog is hidden"
 *     }
 *
 * @apiError {String} error An error occurred while fetching the blog.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while fetching the blog"
 *     }
 */

/**
 * @api {PUT} /api/blogs/:id Update Blog Post
 * @apiName UpdateBlogPost
 * @apiGroup Blogs
 * @apiDescription Updates a blog post's title, description, tags, and codes. Only the blog author or admin can update the blog post.
 *
 * @apiParam {Number} id The ID of the blog post to update.
 * @apiParam {String} [title] The new title of the blog post.
 * @apiParam {String} [description] The new content of the blog post.
 * @apiParam {Number[]} [tagIds] An array of tag IDs to associate with the blog post.
 * @apiParam {Number[]} [codeIds] An array of code IDs to associate with the blog post.
 * 
 * @apiSuccess {Object} blog The updated blog post object.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "blog": {
 *         "id": 1,
 *         "title": "Updated Blog Title",
 *         "description": "Updated blog content",
 *         "tags": [{ "id": 1 }],
 *         "codes": [{ "id": 10 }]
 *       }
 *     }
 *
 * @apiError {String} error Blog not found.
 * @apiErrorExample {json} Blog Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Blog not found"
 *     }
 *
 * @apiError {String} error Forbidden: You cannot edit this blog.
 * @apiErrorExample {json} Forbidden Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "Forbidden: You cannot edit this blog"
 *     }
 *
 * @apiError {String} error An error occurred while updating the blog.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while updating the blog"
 *     }
 */

/**
 * @api {DELETE} /api/blogs/:id Delete Blog Post
 * @apiName DeleteBlogPost
 * @apiGroup Blogs
 * @apiDescription Deletes a blog post by ID, including associated comments and reports. Only the blog author or admin can delete the blog post.
 *
 * @apiParam {Number} id The ID of the blog post to delete.
 * 
 * @apiSuccess {String} message Successfully deleted blog.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 204 No Content
 *     {
 *       "message": "Successfully deleted blog"
 *     }
 *
 * @apiError {String} error Blog not found.
 * @apiErrorExample {json} Blog Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Blog not found"
 *     }
 *
 * @apiError {String} error Forbidden: You cannot delete this blog.
 * @apiErrorExample {json} Forbidden Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "Forbidden: You cannot delete this blog"
 *     }
 *
 * @apiError {String} error An error occurred while deleting the blog.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while deleting the blog"
 *     }
 */





// API/Documentation for the Blog Search Routes




/**
 * @api {GET} /api/blogs/search Retrieve All Blogs
 * @apiName GetAllBlogs
 * @apiGroup Blogs
 * @apiDescription Retrieves all blog posts that are either public (not hidden) or authored by the requesting authenticated user.
 *
 * @apiSuccess {Object[]} blogs An array of blog post objects, including details like tags.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "title": "Sample Blog Title",
 *         "description": "Blog content",
 *         "authorId": 123,
 *         "hidden": false,
 *         "tags": [{ "id": 1, "name": "tag1" }]
 *       },
 *       {
 *         "id": 2,
 *         "title": "Another Blog",
 *         "description": "Another content",
 *         "authorId": 456,
 *         "hidden": true,
 *         "tags": [{ "id": 2, "name": "tag2" }]
 *       }
 *     ]
 *
 * @apiError {String} error An error occurred while fetching all blogs.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while fetching all blogs"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */




/**
 * @api {GET} /api/blogs/search/tags Search Blogs by Tag
 * @apiName SearchBlogsByTag
 * @apiGroup Blogs
 * @apiDescription Searches for blog posts with tags that match a given search term. Returns blogs that are public or authored by the requesting user.
 *
 * @apiParam {String} searchTerm The term to search for in blog tags.
 * 
 * @apiSuccess {Object[]} blogs An array of blog post objects that match the search term in their tags, including details like tags.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "title": "Sample Blog with Matching Tag",
 *         "description": "Blog content",
 *         "authorId": 123,
 *         "hidden": false,
 *         "tags": [{ "id": 1, "name": "searchTerm" }]
 *       },
 *       {
 *         "id": 2,
 *         "title": "Another Blog",
 *         "description": "Another content",
 *         "authorId": 456,
 *         "hidden": true,
 *         "tags": [{ "id": 2, "name": "searchTerm" }]
 *       }
 *     ]
 *
 * @apiError {String} error Search term is required.
 * @apiErrorExample {json} Missing Search Term Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Search term is required"
 *     }
 * 
 * @apiError {String} error An error occurred while searching by tags.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while searching by tags"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */




/**
 * @api {GET} /api/blogs/search/Title Search Blogs by Title
 * @apiName SearchBlogsByTitle
 * @apiGroup Blogs
 * @apiDescription Searches for blog posts with titles that contain a specified search term. Returns blogs that are public or authored by the requesting user.
 *
 * @apiParam {String} searchTerm The term to search for in blog titles.
 * 
 * @apiSuccess {Object[]} blogs An array of blog post objects that match the search term in their titles, including details like tags.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "title": "Sample Blog Title",
 *         "description": "Blog content",
 *         "authorId": 123,
 *         "hidden": false,
 *         "tags": [{ "id": 1, "name": "tag1" }]
 *       },
 *       {
 *         "id": 2,
 *         "title": "Another Blog with Title Match",
 *         "description": "Another content",
 *         "authorId": 456,
 *         "hidden": true,
 *         "tags": [{ "id": 2, "name": "tag2" }]
 *       }
 *     ]
 *
 * @apiError {String} error Search term is required.
 * @apiErrorExample {json} Missing Search Term Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Search term is required"
 *     }
 * 
 * @apiError {String} error An error occurred while searching by title.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while searching by title"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */





/**
 * @api {GET} /api/blogs/search/content Search Blogs by Content
 * @apiName SearchBlogsByContent
 * @apiGroup Blogs
 * @apiDescription Searches for blog posts where the content contains a specified search term. Returns blogs that are public or authored by the requesting user.
 *
 * @apiParam {String} searchTerm The term to search for within the blog content.
 * 
 * @apiSuccess {Object[]} blogs An array of blog post objects that match the search term in their content, including details like tags.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "title": "Blog with Matching Content",
 *         "description": "Brief description",
 *         "content": "Content with searchTerm",
 *         "authorId": 123,
 *         "hidden": false,
 *         "tags": [{ "id": 1, "name": "tag1" }]
 *       },
 *       {
 *         "id": 2,
 *         "title": "Another Blog",
 *         "description": "Another description",
 *         "content": "Another content containing searchTerm",
 *         "authorId": 456,
 *         "hidden": true,
 *         "tags": [{ "id": 2, "name": "tag2" }]
 *       }
 *     ]
 *
 * @apiError {String} error Search term is required.
 * @apiErrorExample {json} Missing Search Term Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Search term is required"
 *     }
 * 
 * @apiError {String} error An error occurred while searching by content.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while searching by content"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */





/**
 * @api {GET} /api/blogs/search/codes Search Blogs by Codes
 * @apiName SearchBlogsByCodes
 * @apiGroup Blogs
 * @apiDescription Searches for blog posts that contain code snippets matching a specified search term. Returns blogs that are public or authored by the requesting user.
 *
 * @apiParam {String} searchTerm The term to search for within blog content related to code snippets.
 * 
 * @apiSuccess {Object[]} blogs An array of blog post objects that match the search term in their code-related content, including details like tags.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "title": "Blog with Matching Code Snippet",
 *         "description": "Brief description",
 *         "content": "Code-related content containing searchTerm",
 *         "authorId": 123,
 *         "hidden": false,
 *         "tags": [{ "id": 1, "name": "tag1" }]
 *       },
 *       {
 *         "id": 2,
 *         "title": "Another Blog",
 *         "description": "Another description",
 *         "content": "Another code content containing searchTerm",
 *         "authorId": 456,
 *         "hidden": true,
 *         "tags": [{ "id": 2, "name": "tag2" }]
 *       }
 *     ]
 *
 * @apiError {String} error Search term is required.
 * @apiErrorExample {json} Missing Search Term Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Search term is required"
 *     }
 * 
 * @apiError {String} error An error occurred while searching by content.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while searching by content"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */





/**
 * @api {GET} /api/blogs/search Aggregated Search Blogs by Category
 * @apiName AggregatedSearchBlogs
 * @apiGroup Blogs
 * @apiDescription Searches for blog posts across multiple categories (title, content, tags, codes) based on a search term. Supports pagination and returns unique results across categories.
 *
 * @apiParam {String[]} category The categories to search within (e.g., "title", "content", "tags", "codes"). If omitted, all categories are searched.
 * @apiParam {String} searchTerm The term to search for in the specified categories.
 * @apiParam {Number} [page=1] The page number for paginating results.
 * @apiParam {Number} [limit=10] The number of results per page.
 * 
 * @apiSuccess {Object[]} results An array of unique blog post objects that match the search criteria across specified categories.
 * @apiSuccess {Number} total The total number of unique matching results.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "results": [
 *         {
 *           "id": 1,
 *           "title": "Matching Title",
 *           "description": "Description",
 *           "authorId": 123,
 *           "hidden": false,
 *           "tags": [{ "id": 1, "name": "tag1" }]
 *         },
 *         {
 *           "id": 2,
 *           "title": "Another Blog",
 *           "description": "Another Description",
 *           "authorId": 456,
 *           "hidden": true,
 *           "tags": [{ "id": 2, "name": "tag2" }]
 *         }
 *       ],
 *       "total": 2
 *     }
 *
 * @apiError {String} error Invalid category.
 * @apiErrorExample {json} Invalid Category Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Invalid category"
 *     }
 * 
 * @apiError {String} error An error occurred while searching.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while searching"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */



// API/Documentation for the Blog Filter Routes


/**
 * @api {GET} /api/blogs/filter/blogRatings Filter Blogs by Ratings
 * @apiName FilterBlogsByRatings
 * @apiGroup Blogs
 * @apiDescription Filters blog posts based on upvotes or downvotes. Blogs can be sorted by "value" (upvotes) or "controversial" (downvotes) to highlight popular or controversial posts.
 *
 * @apiParam {String} filterType The type of rating filter to apply. Accepted values are "value" (for upvotes) and "controversial" (for downvotes).
 * 
 * @apiSuccess {Object[]} blogs An array of blog post objects, sorted by the specified rating filter, including tags, codes, and comments.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "title": "Popular Blog",
 *         "description": "Content",
 *         "upvotes": 150,
 *         "downvotes": 10,
 *         "tags": [{ "id": 1, "name": "tag1" }],
 *         "codes": [{ "id": 1, "name": "code1" }],
 *         "comments": [
 *           {
 *             "id": 101,
 *             "content": "Great post!",
 *             "upvotes": 50,
 *             "downvotes": 5
 *           }
 *         ]
 *       },
 *       {
 *         "id": 2,
 *         "title": "Controversial Blog",
 *         "description": "Another content",
 *         "upvotes": 20,
 *         "downvotes": 75,
 *         "tags": [{ "id": 2, "name": "tag2" }],
 *         "codes": [{ "id": 2, "name": "code2" }],
 *         "comments": [
 *           {
 *             "id": 102,
 *             "content": "Interesting perspective",
 *             "upvotes": 10,
 *             "downvotes": 30
 *           }
 *         ]
 *       }
 *     ]
 *
 * @apiError {String} error Invalid filter type.
 * @apiErrorExample {json} Invalid Filter Type Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Invalid filter type"
 *     }
 * 
 * @apiError {String} error An error occurred while fetching blogs.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while fetching blogs"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */




/**
 * @api {GET} /api/blogs/filter/commentRatings Filter Comments by Ratings for Blog
 * @apiName FilterCommentsByRatings
 * @apiGroup Blogs
 * @apiDescription Filters comments on a specific blog post based on upvotes or downvotes. Comments can be sorted by "value" (upvotes) or "controversial" (downvotes) to highlight popular or controversial comments.
 *
 * @apiParam {Number} blogId The ID of the blog post for which to filter comments.
 * @apiParam {String} filterType The type of rating filter to apply. Accepted values are "value" (for upvotes) and "controversial" (for downvotes).
 * 
 * @apiSuccess {Object[]} comments An array of comment objects, sorted by the specified rating filter.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 101,
 *         "content": "Insightful comment",
 *         "upvotes": 50,
 *         "downvotes": 5,
 *         "authorId": 123,
 *         "hidden": false
 *       },
 *       {
 *         "id": 102,
 *         "content": "Controversial opinion",
 *         "upvotes": 10,
 *         "downvotes": 30,
 *         "authorId": 456,
 *         "hidden": true
 *       }
 *     ]
 *
 * @apiError {String} error Blog ID is required.
 * @apiErrorExample {json} Missing Blog ID Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Blog ID is required"
 *     }
 * 
 * @apiError {String} error Invalid filter type.
 * @apiErrorExample {json} Invalid Filter Type Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Invalid filter type"
 *     }
 * 
 * @apiError {String} error An error occurred while fetching comments.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while fetching comments"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */






// API/Documentation for the Blog Interact Routes


/**
 * @api {POST} /api/blogs/interact/downvote Downvote a Blog Post
 * @apiName DownvoteBlogPost
 * @apiGroup Blogs
 * @apiDescription Allows an authenticated user to downvote a specific blog post. If the user previously upvoted the blog, their vote is changed to a downvote.
 *
 * @apiParam {Number} id The ID of the blog post to downvote (passed as a query parameter).
 * 
 * @apiSuccess {String} message Downvote status message.
 * 
 * @apiSuccessExample {json} Success Response (Changed vote to downvote):
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Changed vote to downvote"
 *     }
 * 
 * @apiSuccessExample {json} Success Response (Downvoted successfully):
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Downvoted successfully"
 *     }
 *
 * @apiError {String} error Blog not found.
 * @apiErrorExample {json} Blog Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Blog not found"
 *     }
 * 
 * @apiError {String} error This blog is hidden and cannot be modified.
 * @apiErrorExample {json} Forbidden Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "This blog is hidden and cannot be modified"
 *     }
 * 
 * @apiError {String} error You have already downvoted this blog.
 * @apiErrorExample {json} Already Downvoted Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "You have already downvoted this blog"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 * 
 * @apiError {String} error An error occurred while downvoting the blog.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while downvoting the blog"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */


/**
 * @api {POST} /api/blogs/interact/upvote Upvote a Blog Post
 * @apiName UpvoteBlogPost
 * @apiGroup Blogs
 * @apiDescription Allows an authenticated user to upvote a specific blog post. If the user previously downvoted the blog, their vote is changed to an upvote.
 *
 * @apiParam {Number} id The ID of the blog post to upvote (passed as a query parameter).
 * 
 * @apiSuccess {String} message Upvote status message.
 * 
 * @apiSuccessExample {json} Success Response (Changed vote to upvote):
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Changed vote to upvote"
 *     }
 * 
 * @apiSuccessExample {json} Success Response (Upvoted successfully):
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Upvoted successfully"
 *     }
 *
 * @apiError {String} error Blog not found.
 * @apiErrorExample {json} Blog Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Blog not found"
 *     }
 * 
 * @apiError {String} error This blog is hidden and cannot be modified.
 * @apiErrorExample {json} Forbidden Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "This blog is hidden and cannot be modified"
 *     }
 * 
 * @apiError {String} error You have already upvoted this blog.
 * @apiErrorExample {json} Already Upvoted Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "You have already upvoted this blog"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 * 
 * @apiError {String} error An error occurred while upvoting the blog.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while upvoting the blog"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */




// API/Documentation for the Comments Routes


/**
 * @api {POST} /api/comments/create Create a New Comment
 * @apiName CreateComment
 * @apiGroup Comments
 * @apiDescription Allows an authenticated user to add a new comment to a specified blog post. Supports creating replies by specifying a parent comment ID.
 *
 * @apiParam {Number} blogId The ID of the blog post to which the comment belongs.
 * @apiParam {String} content The text content of the comment.
 * @apiParam {Number} [parentId] The ID of the parent comment if this comment is a reply.
 * 
 * @apiSuccess {Object} comment The newly created comment object, including content, blog ID, author ID, and parent ID if applicable.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "comment": {
 *         "id": 1,
 *         "content": "This is a comment.",
 *         "blogId": 123,
 *         "authorId": 456,
 *         "parentId": null,
 *         "replies": []
 *       }
 *     }
 *
 * @apiError {String} error blogId and content are required.
 * @apiErrorExample {json} Missing Fields Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "blogId and content are required"
 *     }
 * 
 * @apiError {String} error Parent comment not found.
 * @apiErrorExample {json} Parent Comment Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Parent comment not found"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 * 
 * @apiError {String} error An error occurred while creating the comment.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while creating the comment"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */




/**
 * @api {PUT} /api/comments/:id Update a Comment
 * @apiName UpdateComment
 * @apiGroup Comments
 * @apiDescription Allows an authenticated user to update their own comment. Hidden comments cannot be edited by other users.
 *
 * @apiParam {Number} id The ID of the comment to update.
 * @apiParam {String} content The updated content for the comment.
 * 
 * @apiSuccess {Object} comment The updated comment object with new content.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "comment": {
 *         "id": 1,
 *         "content": "Updated comment content",
 *         "authorId": 456,
 *         "blogId": 123,
 *         "parentId": null,
 *         "replies": []
 *       }
 *     }
 *
 * @apiError {String} error Comment not found.
 * @apiErrorExample {json} Comment Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Comment not found"
 *     }
 *
 * @apiError {String} error This comment is hidden or cannot be edited.
 * @apiErrorExample {json} Forbidden Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "This comment is hidden and cannot be edited"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 * 
 * @apiError {String} error An error occurred while updating the comment.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while updating the comment"
 *     }
 */

/**
 * @api {DELETE} /api/comments/:id Delete a Comment
 * @apiName DeleteComment
 * @apiGroup Comments
 * @apiDescription Allows an authenticated user to delete their own comment. Hidden comments cannot be deleted by other users.
 *
 * @apiParam {Number} id The ID of the comment to delete.
 * 
 * @apiSuccess {String} message Successfully deleted comment.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 204 No Content
 *     {
 *       "message": "Successfully deleted comment"
 *     }
 *
 * @apiError {String} error Comment not found.
 * @apiErrorExample {json} Comment Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Comment not found"
 *     }
 *
 * @apiError {String} error This comment is hidden or cannot be deleted.
 * @apiErrorExample {json} Forbidden Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "This comment is hidden and cannot be deleted"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 * 
 * @apiError {String} error An error occurred while deleting the comment.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while deleting the comment"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */



/**
 * @api {POST} /api/comments/interact/upvote Upvote a Comment
 * @apiName UpvoteComment
 * @apiGroup Comments
 * @apiDescription Allows an authenticated user to upvote a specific comment. If the user previously downvoted the comment, their vote is changed to an upvote.
 *
 * @apiParam {Number} id The ID of the comment to upvote (passed as a query parameter).
 * 
 * @apiSuccess {String} message Upvote status message.
 * 
 * @apiSuccessExample {json} Success Response (Changed vote to upvote):
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Changed vote to upvote"
 *     }
 * 
 * @apiSuccessExample {json} Success Response (Upvoted successfully):
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Upvoted successfully"
 *     }
 *
 * @apiError {String} error Comment not found.
 * @apiErrorExample {json} Comment Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Comment not found"
 *     }
 * 
 * @apiError {String} error This comment is hidden and cannot be modified.
 * @apiErrorExample {json} Forbidden Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "This comment is hidden and cannot be modified"
 *     }
 * 
 * @apiError {String} error You have already upvoted this comment.
 * @apiErrorExample {json} Already Upvoted Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "You have already upvoted this comment"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 * 
 * @apiError {String} error An error occurred while upvoting the comment.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while upvoting the comment"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */


/**
 * @api {POST} /api/comments/interact/downvote Downvote a Comment
 * @apiName DownvoteComment
 * @apiGroup Comments
 * @apiDescription Allows an authenticated user to downvote a specific comment. If the user previously upvoted the comment, their vote is changed to a downvote.
 *
 * @apiParam {Number} id The ID of the comment to downvote (passed as a query parameter).
 * 
 * @apiSuccess {String} message Downvote status message.
 * 
 * @apiSuccessExample {json} Success Response (Changed vote to downvote):
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Changed vote to downvote"
 *     }
 * 
 * @apiSuccessExample {json} Success Response (Downvoted successfully):
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Downvoted successfully"
 *     }
 *
 * @apiError {String} error Comment not found.
 * @apiErrorExample {json} Comment Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Comment not found"
 *     }
 * 
 * @apiError {String} error This comment is hidden and cannot be modified.
 * @apiErrorExample {json} Forbidden Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "This comment is hidden and cannot be modified"
 *     }
 * 
 * @apiError {String} error You have already downvoted this comment.
 * @apiErrorExample {json} Already Downvoted Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "You have already downvoted this comment"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 * 
 * @apiError {String} error An error occurred while downvoting the comment.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while downvoting the comment"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */





// API/Documentation for the Reports Routes

/**
 * @api {POST} /api/reports/reportContent Report Inappropriate Content
 * @apiName ReportContent
 * @apiGroup Reports
 * @apiDescription Allows an authenticated user to report inappropriate content. Supports reporting both blogs and comments with a detailed explanation.
 *
 * @apiParam {Number} parentId The ID of the content (blog or comment) being reported.
 * @apiParam {String="blog","comment"} parentType The type of content being reported, either "blog" or "comment".
 * @apiParam {String} explanation A detailed explanation for why the content is being reported.
 * 
 * @apiSuccess {String} message Confirmation of successful report submission.
 * @apiSuccess {Object} report The created report object, including parent ID, type, and explanation.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": "Report submitted successfully",
 *       "report": {
 *         "id": 1,
 *         "explanation": "Inappropriate content",
 *         "parentId": 123,
 *         "parentType": "comment"
 *       }
 *     }
 *
 * @apiError {String} error All fields (parentId, parentType, explanation) are required.
 * @apiErrorExample {json} Missing Fields Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "All fields (parentId, parentType, explanation) are required"
 *     }
 * 
 * @apiError {String} error parentType must be either "blog" or "comment".
 * @apiErrorExample {json} Invalid Parent Type Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "parentType must be either 'blog' or 'comment'"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Not authorized"
 *     }
 * 
 * @apiError {String} error An error occurred while submitting the report.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while submitting the report"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */





/**
 * @api {PATCH} /api/reports/hideReportedContent Hide Reported Content
 * @apiName HideReportedContent
 * @apiGroup Reports
 * @apiDescription Allows an admin to hide reported content (either a blog or comment) by setting its visibility to hidden.
 *
 * @apiParam {Number} contentId The ID of the content (blog or comment) to be hidden.
 * @apiParam {String="blog","comment"} contentType The type of content to hide, either "blog" or "comment".
 * 
 * @apiSuccess {String} message Confirmation that the content has been hidden successfully.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Content has been hidden successfully"
 *     }
 *
 * @apiError {String} error Content ID and type are required.
 * @apiErrorExample {json} Missing Parameters Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Content ID and type are required"
 *     }
 * 
 * @apiError {String} error Content type must be either "blog" or "comment".
 * @apiErrorExample {json} Invalid Content Type Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Content type must be either 'blog' or 'comment'"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Not authorized"
 *     }
 * 
 * @apiError {String} error An error occurred while hiding the content.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while hiding the content"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */





/**
 * @api {GET} /api/reports/sortReportedContent Sort Reported Content by Report Count
 * @apiName SortReportedContent
 * @apiGroup Reports
 * @apiDescription Allows an admin to retrieve and sort reported content (blogs and comments) by the number of reports, with pagination support.
 *
 * @apiParam {Number} [page=1] The page number for pagination.
 * @apiParam {Number} [limit=10] The number of items per page.
 * 
 * @apiSuccess {Number} page The current page number.
 * @apiSuccess {Number} limit The number of items per page.
 * @apiSuccess {Number} total The total number of reported items.
 * @apiSuccess {Object[]} data An array of reported content objects, each with a type (blog or comment), report count, and other details.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "page": 1,
 *       "limit": 10,
 *       "total": 25,
 *       "data": [
 *         {
 *           "id": 1,
 *           "title": "Reported Blog",
 *           "content": "Blog content",
 *           "type": "blog",
 *           "reportCount": 5,
 *           "reports": [{ "id": 101, "explanation": "Inappropriate content" }]
 *         },
 *         {
 *           "id": 2,
 *           "content": "Reported comment content",
 *           "type": "comment",
 *           "reportCount": 3,
 *           "reports": [{ "id": 102, "explanation": "Spam" }]
 *         }
 *       ]
 *     }
 *
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Not authorized"
 *     }
 * 
 * @apiError {String} error An error occurred while fetching reported content.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while fetching reported content"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */






// API/Documentation for the Codes Routes


/**
 * @api {POST} /api/codes/create Create a New Code Template
 * @apiName CreateCodeTemplate
 * @apiGroup Codes
 * @apiDescription Allows an authenticated user to create a new code template with a title, explanation, content, and associated tags.
 *
 * @apiParam {String} title The title of the code template.
 * @apiParam {String} explanation A brief explanation of the code template.
 * @apiParam {String} content The code content for the template.
 * @apiParam {Number[]} tagIds An array of tag IDs to associate with the code template.
 * 
 * @apiSuccess {Object} blog The newly created code template object, including title, explanation, content, and associated tags.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "blog": {
 *         "id": 1,
 *         "title": "Sample Code Template",
 *         "explanation": "This template demonstrates X concept",
 *         "content": "function example() { ... }",
 *         "authorId": 456,
 *         "tags": [{ "id": 1, "name": "JavaScript" }]
 *       }
 *     }
 *
 * @apiError {String} error Title and explanation are required.
 * @apiErrorExample {json} Missing Fields Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Title and explanation are required"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 * 
 * @apiError {String} error An error occurred while creating the code template.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while creating the code template"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */



/**
 * @api {GET} /api/codes/:id Get Code Template by ID
 * @apiName GetCodeTemplate
 * @apiGroup Codes
 * @apiDescription Retrieves a code template by its ID, including associated blogs and tags with pagination support.
 *
 * @apiParam {Number} id The ID of the code template to retrieve.
 * @apiParam {Number} [page=1] The page number for pagination of blogs and tags.
 * @apiParam {Number} [limit=10] The number of items per page for blogs and tags.
 * 
 * @apiSuccess {Object} codeTemplate The code template object, including details, associated blogs, and tags.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "codeTemplate": {
 *         "id": 1,
 *         "title": "Sample Code Template",
 *         "explanation": "Explanation of the template",
 *         "content": "function example() { ... }",
 *         "blogs": [
 *           { "id": 101, "title": "Related Blog" }
 *         ],
 *         "tags": [
 *           { "id": 1, "name": "JavaScript" }
 *         ]
 *       }
 *     }
 *
 * @apiError {String} error Code template not found.
 * @apiErrorExample {json} Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Code template not found"
 *     }
 * 
 * @apiError {String} error An error occurred while fetching the code template.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while fetching the code template"
 *     }
 */

/**
 * @api {PUT} /api/codes/:id Update Code Template
 * @apiName UpdateCodeTemplate
 * @apiGroup Codes
 * @apiDescription Allows an authenticated user to update their own code template.
 *
 * @apiParam {Number} id The ID of the code template to update.
 * @apiParam {String} title The updated title of the code template.
 * @apiParam {String} explanation The updated explanation for the code template.
 * @apiParam {String} content The updated content of the code template.
 * @apiParam {Number[]} tagIds An array of tag IDs to associate with the code template.
 * 
 * @apiSuccess {Object} blog The updated code template object.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "blog": {
 *         "id": 1,
 *         "title": "Updated Code Template",
 *         "explanation": "Updated explanation",
 *         "content": "Updated content",
 *         "tags": [{ "id": 1, "name": "JavaScript" }]
 *       }
 *     }
 *
 * @apiError {String} error Title and explanation are required.
 * @apiErrorExample {json} Missing Fields Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Title and explanation are required"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 * 
 * @apiError {String} error An error occurred while updating the code template.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while updating the code template"
 *     }
 */

/**
 * @api {DELETE} /api/codes/:id Delete Code Template
 * @apiName DeleteCodeTemplate
 * @apiGroup Codes
 * @apiDescription Allows an authenticated user to delete their own code template, including associated references in blogs and user data.
 *
 * @apiParam {Number} id The ID of the code template to delete.
 * 
 * @apiSuccess {String} message Confirmation of successful deletion.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 204 No Content
 *     {
 *       "message": "Successfully deleted code template"
 *     }
 *
 * @apiError {String} error Code template not found.
 * @apiErrorExample {json} Not Found Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Code template not found"
 *     }
 * 
 * @apiError {String} error Forbidden: You are not the author of this code template.
 * @apiErrorExample {json} Forbidden Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "Forbidden: You are not the author of this code template"
 *     }
 * 
 * @apiError {String} error Unauthorized.
 * @apiErrorExample {json} Unauthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 * 
 * @apiError {String} error An error occurred while deleting the code template.
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while deleting the code template"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */




// API/Documentation for the Execution Routes

/**
 * @api {POST} /api/execution/execute Execute Code
 * @apiName ExecuteCode
 * @apiGroup Execution
 * @apiDescription Allows a user to execute code in various programming languages (Python, JavaScript, Java, C, C++) with optional input. The endpoint compiles and runs the code, returning the output or any errors.
 *
 * @apiParam {String} code The code to execute.
 * @apiParam {String="python","javascript","java","c","cpp"} language The programming language of the code.
 * @apiParam {String} [input=""] Optional input data for the code execution.
 * 
 * @apiSuccess {String} output The standard output from the code execution.
 * @apiSuccess {String} error Any errors encountered during code execution (e.g., runtime errors, compilation errors).
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "output": "Hello, World!",
 *       "error": ""
 *     }
 *
 * @apiError {String} error Code and language are required.
 * @apiErrorExample {json} Missing Fields Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Code and language are required"
 *     }
 * 
 * @apiError {String} error Unsupported language.
 * @apiErrorExample {json} Unsupported Language Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Unsupported language"
 *     }
 * 
 * @apiError {String} error An error occurred while executing the code.
 * @apiErrorExample {json} Execution Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred while executing the code"
 *     }
 * 
 * @apiError {String} error Method not allowed.
 * @apiErrorExample {json} Method Not Allowed Response:
 *     HTTP/1.1 405 Method Not Allowed
 *     {
 *       "error": "Method not allowed"
 *     }
 */
