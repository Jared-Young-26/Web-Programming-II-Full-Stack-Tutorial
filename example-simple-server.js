import http from "http";

const PORT = process.env.PORT || 8080;

const defaultHtml = "<html><body>Hello!</body></html>";

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/time") {
    const now = new Date().toISOString();
    const html = `<html><body>Server time: ${now}</body></html>`;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }

  // Fallback
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(defaultHtml);
});

server.listen(PORT, () => {
  console.log(`Simple server listening on http://localhost:${PORT}`);
});