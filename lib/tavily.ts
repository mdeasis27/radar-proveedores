// Tavily API client — búsqueda multi-query para due diligence de proveedores

const TAVILY_API_URL = "https://api.tavily.com/search";

export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilySearchResponse {
  results: TavilyResult[];
  query: string;
}

async function search(query: string, maxResults = 5): Promise<TavilyResult[]> {
  const res = await fetch(TAVILY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      max_results: maxResults,
      search_depth: "advanced",
      include_answer: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Tavily error: ${res.status} ${res.statusText}`);
  }

  const data: TavilySearchResponse = await res.json();
  return data.results;
}

export async function searchSupplier(company: string, country?: string) {
  const suffix = country ? ` ${country}` : "";

  const queries = [
    `"${company}"${suffix} fraude estafa demanda judicial sanciones`,
    `"${company}"${suffix} fundadores CEO historia empresa`,
    `"${company}"${suffix} noticias recientes ${new Date().getFullYear()}`,
    `"${company}"${suffix} clientes reseñas reputación`,
  ];

  const results = await Promise.all(queries.map((q) => search(q)));

  return queries.map((query, i) => ({ query, results: results[i] }));
}
