const express = require("express");
require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const router = express.Router();

// In-memory cache for articles (resets every 1 hour)
const articleCache = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const VALID_CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];

router.get("/news/:category", async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  try {
    if (!process.env.GNEWS_API_KEY) {
      console.error("GNEWS_API_KEY is not configured");
      return res.status(500).json({ 
        message: "API key not configured",
        status: "error"
      });
    }

    // Check if we have cached articles for this category and they're fresh
    const now = Date.now();
    let articles = null;
    if (articleCache[category] && (now - articleCache[category].timestamp) < CACHE_DURATION) {
      console.log(`[NEWS API] Using cached articles for ${category}`);
      articles = articleCache[category].data;
    } else {
      // Fetch fresh articles from GNews API - fetch multiple pages to get more articles
      // GNews free tier allows max 100 per request, so fetch 5 pages = 500 articles
      const allArticles = [];
      const totalPages = 5; // Fetch 5 pages of 100 articles each = 500 total
      
      console.log(`[NEWS API] Fetching fresh news for category: ${category} (${totalPages} pages)`);

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        try {
          const url = `https://gnews.io/api/v4/top-headlines?topic=${category}&lang=en&country=in&max=100&sortby=publishedAt&page=${pageNum}&token=${process.env.GNEWS_API_KEY}`;
          
          console.log(`[NEWS API] Fetching page ${pageNum}/${totalPages}`);
          
          const response = await fetch(url);
          const data = await response.json();

          if (!response.ok) {
            console.warn(`[NEWS API] Page ${pageNum} error: ${data.message}`);
            continue; // Skip to next page on error
          }

          if (data.articles && Array.isArray(data.articles)) {
            console.log(`[NEWS API] Page ${pageNum}: Got ${data.articles.length} articles`);
            allArticles.push(...data.articles);
          } else {
            console.warn(`[NEWS API] Page ${pageNum}: No articles in response`);
          }
        } catch (pageError) {
          console.warn(`[NEWS API] Page ${pageNum} fetch failed:`, pageError.message);
          continue; // Continue with next page on error
        }
      }

      if (allArticles.length === 0) {
        console.error(`[NEWS API] No articles fetched for category: ${category}`);
        return res.status(500).json({ 
          status: "error",
          message: "No articles found for this category",
          details: "Unable to fetch from news provider"
        });
      }

      console.log(`[NEWS API] Total articles fetched and cached: ${allArticles.length}`);

      // Cache all the articles
      articleCache[category] = {
        data: allArticles,
        totalResults: allArticles.length,
        timestamp: now
      };
      articles = allArticles;
    }

    // Paginate the cached articles
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = articles.slice(startIndex, endIndex);

    console.log(`[NEWS API] Returning page ${page} with ${paginatedArticles.length} articles (total cached: ${articles.length})`);
    
    const mappedArticles = paginatedArticles.map((a) => ({
      title: a.title || "No title",
      description: a.description || "No description",
      url: a.url || "#",
      urlToImage: a.image || "https://via.placeholder.com/400x200?text=No+Image",
      author: a.source?.name || "Unknown",
      publishedAt: a.publishedAt || new Date().toISOString(),
      source: { name: a.source?.name || "GNews" },
      content: a.content || "",
    }));

    res.json({
      status: "ok",
      totalResults: articleCache[category]?.totalResults || 0,
      articles: mappedArticles,
      page: page,
      limit: limit,
      cached: (now - articleCache[category]?.timestamp) < CACHE_DURATION,
    });
  } catch (err) {
    console.error("[NEWS API] Exception caught:", err.message);
    console.error("[NEWS API] Error stack:", err.stack);
    
    // Return detailed error for debugging
    const errorDetails = {
      status: "error",
      message: err.message || "Server error while fetching news",
      type: err.constructor.name,
      env: {
        GNEWS_API_KEY_SET: !!process.env.GNEWS_API_KEY,
        MONGO_URI_SET: !!process.env.MONGO_URI,
        NODE_ENV: process.env.NODE_ENV,
      }
    };
    
    console.error("[NEWS API] Error details:", errorDetails);
    res.status(500).json(errorDetails);
  }
});

module.exports = router;
