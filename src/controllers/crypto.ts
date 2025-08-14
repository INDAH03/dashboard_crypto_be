import { Request, Response } from "express";
import bcrypt from "bcrypt";
import axios from "axios";
import dotenv from "dotenv";
import User from "../models/User";
dotenv.config();

export const getPrices = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const per_page = Number(req.query.per_page) || 50;
    const ids = req.query.ids as string | undefined; 

    let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=false`;

    if (ids) {
      url += `&ids=${ids}`;
    }

    const { data } = await axios.get(url);

    res.json(data);
  } catch (error) {
    console.error("Error fetching complex crypto prices:", error);
    res.status(500).json({ error: "Failed to fetch complex crypto prices" });
  }
};

// export const getCoinDetail = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const url = `https://api.coingecko.com/api/v3/coins/${id}`;

//     const { data } = await axios.get(url);

//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching coin detail:", error);
//     res.status(500).json({ error: "Failed to fetch coin detail" });
//   }
// };

export const getCoinDetail = async (req: Request, res: Response) => {
  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
  const id = req.params.id;

  const fetchCoin = async (id: string) => {
    const url = `https://api.coingecko.com/api/v3/coins/${id}`;
    let attempt = 0;

    while (attempt < 5) {
      try {
        const { data } = await axios.get(url);
        return data;
      } catch (error: any) {
        if (error.response && error.response.status === 429) {
          const retryAfter = parseInt(error.response.headers['retry-after'] || '60', 10) * 1000;
          console.warn(`Rate limit hit. Retrying after ${retryAfter / 1000}s...`);
          await sleep(retryAfter);
          attempt++;
        } else {
          throw error;
        }
      }
    }

    throw new Error("Failed to fetch coin detail after retries");
  };

  try {
    const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "Missing coin ID" });
  }

  const data = await fetchCoin(id);
    res.json(data);
  } catch (err: any) {
    console.error("Error fetching coin detail:", err.message || err);
    res.status(500).json({ error: "Failed to fetch coin detail" });
  }
};

export const getTopCoins = async (req: Request, res: Response) => {
  try {

    const { data: coins } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 6,
          page: 1,
        },
      }
    );

    const charts: Record<string, number[]> = {};
    await Promise.all(
      coins.map(async (coin: any) => {
        const { data } = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart`,
          { params: { vs_currency: "usd", days: 7, interval: "daily" } }
        );
        charts[coin.id] = data.prices.map((p: number[]) => p[1]);
      })
    );

    res.json({ coins, charts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top coins with chart" });
  }
};

export const getCryptoNews = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 6 } = req.query;
    const apiKey = process.env.NEWS_API_KEY;
if (!apiKey) {
  return res.status(500).json({ error: "Missing NEWS_API_KEY in environment variables" });
}

    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "cryptocurrency",
        language: "en",
        page,
        pageSize,
        apiKey
      }
    });
    const articles = response.data.articles.map((item: any) => ({
      title: item.title,
      description: item.description,
      url: item.url,
      urlToImage: item.urlToImage,
      publishedAt: item.publishedAt,
      source: item.source.name,
    }));

    res.json({
      totalResults: response.data.totalResults,
      articles,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

export const UpdateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updateData: Partial<{ name: string; email: string; password: string }> = { name, email };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const [updated] = await User.update(updateData, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};


// export const getCryptoNews = async (req: Request, res: Response) => {
//   try {
//     const keyword = (req.query.q as string) || "crypto";
//     const page = Number(req.query.page) || 1;
//     const pageSize = Number(req.query.pageSize) || 10;
//     const apiKey = process.env.NEWS_API_KEY as string;

//     const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
//       keyword
//     )}&language=en&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

//     const { data } = await axios.get(url);

//     res.json({
//       totalResults: data.totalResults,
//       articles: data.articles.map((item: any) => ({
//         title: item.title,
//         description: item.description,
//         url: item.url,
//         urlToImage: item.urlToImage,
//         publishedAt: item.publishedAt,
//         source: item.source.name,
//       })),
//     });
//   } catch (error) {
//     console.error("Error fetching crypto news:", error);
//     res.status(500).json({ error: "Failed to fetch crypto news" });
//   }
// };

// export const getCryptoNews = async (req: Request, res: Response) => {
//   try {
//     const keyword = (req.query.q as string) || "crypto"; 
//     const apiKey = process.env.NEWS_API_KEY as string;

//     if (!apiKey) {
//       return res.status(500).json({ error: "Missing NEWS_API_KEY in environment" });
//     }

//     const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
//       keyword
//     )}&language=en&sortBy=publishedAt&apiKey=${apiKey}`;

//     const { data } = await axios.get(url);

//     const articles = data.articles.map((item: any) => ({
//       title: item.title,
//       description: item.description,
//       url: item.url,
//       urlToImage: item.urlToImage,
//       publishedAt: item.publishedAt,
//       source: item.source.name,
//     }));

//     res.json({ totalResults: data.totalResults, articles });
//   } catch (error) {
//     console.error("Error fetching crypto news:", error);
//     res.status(500).json({ error: "Failed to fetch crypto news" });
//   }
// };