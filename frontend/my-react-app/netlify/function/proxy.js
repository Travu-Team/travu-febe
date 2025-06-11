export async function handler(event) {
  const BACKEND_URL = "http://backend.travuu-project.et.r.appspot.com";

  const path = event.path.replace("/api", ""); // Menghapus "/api" agar path tetap sesuai dengan backend
  const url = `${BACKEND_URL}${path}`;
  
  try {
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        "Access-Control-Allow-Origin": "*"
      },
      body: event.body
    });

    const data = await response.text();
    return {
      statusCode: response.status,
      body: data
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching API" })
    };
  }
}
