require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function testGNewsAPI() {
  const apiKey = process.env.GNEWS_API_KEY;
  const category = "entertainment";

  console.log("Testing GNews API...");
  console.log("API Key:", apiKey ? apiKey.substring(0, 5) + "..." : "NOT SET");

  if (!apiKey) {
    console.error("ERROR: GNEWS_API_KEY not found in .env file");
    return;
  }

  try {
    const url = `https://gnews.io/api/v4/top-headlines?topic=${category}&lang=en&country=in&max=10&token=${apiKey}`;
    
    console.log("\nFetching from GNews API...");
    console.log("URL:", url.replace(apiKey, "XXXXX"));
    
    const response = await fetch(url);
    
    console.log("Response Status:", response.status);
    console.log("Response OK:", response.ok);
    
    const data = await response.json();
    
    console.log("\nResponse Data:");
    console.log(JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error("\n⚠️ API Error detected");
      console.error("Error Message:", data.message);
      console.error("Error Details:", data.error);
    } else {
      console.log("\n✅ Success! Articles found:", data.articles?.length || 0);
    }
  } catch (error) {
    console.error("\n❌ Exception occurred:");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

testGNewsAPI();
