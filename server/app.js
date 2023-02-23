var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { default: mongoose } = require("mongoose");
const cors = require('cors');

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// if(process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.resolve("..", "client", "build")));
//   app.get("*", (req, res) => res.sendFile(path.resolve("..", "client", "build", "index.html")))
// } else if(process.env.NODE_ENV === 'development') {
//   var corsOptions = {
//     origin: "http://localhost:3000",
//     optionsSuccessStatus: 200,
//   };
//   app.use(corsOptions)
// }
if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/testdb", (err, client) => {
  if (err) throw err;
  if (client) console.log("---Mongodb Connected---\n");
});

const bookSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
  },
});

const Book = mongoose.model("books", bookSchema);

app.post('/api/book/', (req, res) => {
  const { author, name, pages } = req.body;
  new Book({
    author: author,
    name: name,
    pages: pages,
  }).save((err) => {
    if (err) throw err;
    res.json('ok');
  });
});

app.get('/api/:name', (req, res) => {
  const { name } = req.params;
  Book.findOne({name: name}, (err, book) => {
    if(err) throw err;
    if(book) return res.json(book);
    else return res.status(404).send({
      notFound: true
    });
  });
});

module.exports = app;
