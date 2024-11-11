import axios from "axios";
import { redirect } from "next/navigation";

const API_KEY = process.env.COINGECKO_API_KEY;
const RETRY_LIMIT = 5;  // Número de tentativas antes de falhar
const RETRY_DELAY = 1000;  // Tempo de espera (em ms) entre as tentativas

async function fetchWithRetry(url: string, config: any, retries: number = RETRY_LIMIT): Promise<any> {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 429 && retries > 0) {
      console.log(`Limite de requisições atingido. Tentando novamente em ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));  // Espera antes de tentar novamente
      return fetchWithRetry(url, config, retries - 1);  // Tenta novamente, com um número de tentativas restantes
    }
    throw new Error((error as Error).message);  // Se não for erro 429, ou se esgotaram as tentativas, lança o erro
  }
}

export async function fetchGlobalMarketCap() {
  try {
    const response = await fetchWithRetry(
      "https://api.coingecko.com/api/v3/global",
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function fetchCoins(page = 1, per_page = 100, order = "market_cap_desc") {
  try {
    const response = await fetchWithRetry(
      "https://api.coingecko.com/api/v3/coins/markets?price_change_percentage=24h",
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        params: {
          vs_currency: "usd",
          order: order,
          per_page: per_page,
          page,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function fetchCoinDetails(id: string) {
  try {
    const response = await fetchWithRetry(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error?.response.status == 404) {
      redirect("/404");
    } else {
      throw new Error((error as Error).message);
    }
  }
}

export async function fetchTrendingCoins() {
  try {
    const response = await fetchWithRetry(
      "https://api.coingecko.com/api/v3/search/trending",
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return response.coins;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function fetchCoinChart(id: string, days: number) {
  try {
    const response = await fetchWithRetry(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        params: {
          vs_currency: "usd",
          days: days,
          interval: days > 29 ? "daily" : "",
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function fetchAllCoins() {
  return fetchCoins(1, 100);
}
