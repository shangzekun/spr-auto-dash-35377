export async function mockRequest<T>(data: T, delay = 400): Promise<T> {
  const clone =
    typeof structuredClone === "function"
      ? structuredClone(data)
      : (JSON.parse(JSON.stringify(data)) as T);
  return new Promise((resolve) => setTimeout(() => resolve(clone), delay));
}

// 简单的统一错误处理封装，后续可以替换为真实 fetch
export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
