// In-built modules
const fs = require('fs'); //fie operatons
const http = require('http'); // create http server
const path = require('path'); // handle & transform file paths
const url = require('url'); // parse & mangage urls

// third-party modules
const slugify = require('slugify'); // strings into userFriendly strings

const replaceTemplate = require('./modules/replaceTemplate'); //own-module

////////////////////////
// FILES

// Blocking, Synchronous Way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("FileWritten");

// Non-Blocking, Asynchronous Way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("You File has been written");
//       });
//     });
//   });
// });
// console. log("Will read file");

/////////////////////////
// SERVER

// Read files
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //Json string
const dataObj = JSON.parse(data); //takes json formatted string and convert into js object

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' }); // write http response header and status code
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el)) // replace tempCard with acutal procutName
      .join(''); // joining the array into a single HTML string
    const output = tempOverview.replace('{%PRODUCT_CARDS %}', cardsHtml);
    res.end(output); // send html content and end the response

    // Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world', // custom-header
    });
    res.end('<h1>Page Not Found !</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 80000');
});
