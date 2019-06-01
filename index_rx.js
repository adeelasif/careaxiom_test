const url = require('url');
const http = require('http');
const port = process.env.port || 8080;

const { parsQueryParams, fetchUsingRx } = require('./helpers/utils');
const { handleError, renderResponse } = require('./helpers/response');

const server = http.createServer((req, res) => {
  req.parsedUrl = url.parse(req.url);
  let { pathname } = req.parsedUrl;

  if (pathname === '/I/want/title' && req.method === 'GET') {
    handlePageQuery(req, res);
  } else {
    handleError(req, res);
  }
});

server.listen(port, () => {
  console.log('==>Server Running on https://localhost:' + port);
});

function handlePageQuery(req, res) {
  const urls = parsQueryParams(req.parsedUrl.query).address;

  if (!urls || !urls.length) {
    return res.end(renderResponse());
  }

  fetchUsingRx(urls, (error, titles) => {
    res.end(renderResponse(titles));
  });
}