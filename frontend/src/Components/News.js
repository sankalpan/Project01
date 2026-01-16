import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://project01-r4g7.onrender.com";

export default function News() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const articlesPerPage = 9; // 3 columns x 3 rows
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = page * articlesPerPage;
        console.log("Fetching from:", `${API_URL}/api/news/${category}?page=${page}`);

        const res = await fetch(`${API_URL}/api/news/${category}?page=${page}&limit=${articlesPerPage}`);
        const data = await res.json();

        console.log("API Response:", data);

        if (!res.ok) {
          // Show detailed error from API
          const errorMsg = data.message || `HTTP ${res.status}`;
          const details = data.details?.message || data.details?.error || data.error || "";
          const fullError = details ? `${errorMsg} - ${details}` : errorMsg;
          throw new Error(fullError);
        }

        if (!data.articles) {
          throw new Error("No articles field in response");
        }

        setArticles(data.articles);
        setTotalResults(data.totalResults || 0);
      } catch (err) {
        console.error("News fetch failed:", err.message);
        setError(err.message);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, page]);

  const saveBookmark = async (article) => {
    if (!token) {
      alert("Please login to bookmark articles.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          author: article.author,
          date: article.publishedAt,
          source: article.source.name,
        }),
      });

      if (!res.ok) throw new Error("Bookmark failed");

      alert("Article bookmarked!");
    } catch (err) {
      console.error("Bookmark error:", err.message);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4 text-capitalize">{category} News</h1>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center" role="alert">
          <h4>Failed to fetch news</h4>
          <p>{error}</p>
          <small>Please check your internet connection or try again later.</small>
        </div>
      ) : (
        <>
          <div className="row">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <div className="card h-100">
                    <img
                      src={article.urlToImage}
                      className="card-img-top"
                      alt="news"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x200?text=No+Image+Available";
                      }}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{article.title}</h5>
                      <p className="card-text">{article.description}</p>

                      <a
                        href={article.url}
                        className="btn btn-primary mt-auto"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Read More
                      </a>

                      {token && (
                        <button
                          className="btn btn-outline-secondary btn-sm mt-2"
                          onClick={() => saveBookmark(article)}
                        >
                          🔖 Bookmark
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No articles available 😔</p>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
            <button
              className="btn btn-secondary"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              ← Previous
            </button>

            <span className="text-muted">
              Page <strong>{page + 1}</strong> | Articles {page * articlesPerPage + 1} - {Math.min((page + 1) * articlesPerPage, totalResults)} of <strong>{totalResults}</strong>
            </span>

            <button
              className="btn btn-secondary"
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * articlesPerPage >= totalResults}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
