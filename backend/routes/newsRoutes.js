const express = require("express");
require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const router = express.Router();

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

    // GNews API - fetch more articles to support pagination
    // We fetch a larger batch to ensure we have enough articles for pagination
    const articlesPerFetch = Math.max(50, limit * (page + 2)); // Fetch enough for current and next pages
    const url = `https://gnews.io/api/v4/top-headlines?topic=${category}&lang=en&country=in&max=${Math.min(articlesPerFetch, 100)}&token=${process.env.GNEWS_API_KEY}`;

    console.log(`[NEWS API] Fetching news for category: ${category}, page: ${page}, limit: ${limit}`);
    console.log(`[NEWS API] Request URL: ${url.replace(process.env.GNEWS_API_KEY, 'XXXXX')}`);
    
    const response = await fetch(url);
    const data = await response.json();

    console.log(`[NEWS API] Response status: ${response.status}`);
    console.log(`[NEWS API] Total articles from API: ${data.articles?.length || 0}`);

    if (!response.ok) {
      console.error(`[NEWS API] Error response:`, data);
      return res.status(response.status).json({
        status: "error",
        message: data.message || "Error from GNews API",
        details: data,
      });
    }

    if (!data.articles || !Array.isArray(data.articles)) {
      console.error("[NEWS API] Invalid response format - no articles array found");
      return res.status(500).json({ 
        status: "error",
        message: "Invalid response format from news provider",
        details: data
      });
    }

    // Paginate the articles on the backend
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = data.articles.slice(startIndex, endIndex);

    console.log(`[NEWS API] Successfully fetched ${paginatedArticles.length} articles for page ${page}`);
    
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
      totalResults: data.totalArticles || data.articles.length,
      articles: mappedArticles,
      page: page,
      limit: limit,
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
