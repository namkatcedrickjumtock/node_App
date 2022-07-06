const express = require("express");
const _ = require("lodash");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./Models/blogSchema");

const app = express();

// register new engine
app.set("view engine", "ejs");

// parse url request that can be access in the request body
app.use(express.urlencoded({ extended: true }));
// logging every request made to the server
app.use(morgan("dev"));

// making accessible statics files to be accessbile
app.use(express.static("public")); // specifying the folder dir)

// urlEncide parser for the post request.

const db_URI =
  "mongodb+srv://cedrick:eiJbFs3FHQMcGxjs@cluster0.9pvaglg.mongodb.net/Event-organizer?retryWrites=true&w=majority";

mongoose
  .connect(db_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((results) => {
    // listen for request when db is connected
    console.log("connected to Db");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// adding blog
app.get("/add-blog", (req, res) => {
  const blog = new Blog({
    title: "new Blog",
    snippet: "adding new blog another",
    body: "blog body",
  });

  blog
    .save()
    .then((resp) => {
      res.send(resp);
    })
    .catch((err) => console.log(err));
});

// post request middlewares
app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((resp) => {
      res.redirect("/blogs");
    })
    .catch((err) => console.log(err));
});

// get  request MiddleWares
app.get("/", (req, res) => {
  const blogs = [];
  res.redirect("/blogs");
});

// details request midleware

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((res) => {
      res.render("detailsBlog", { title: "details page", blogs: res });
    })
    .catch((err) => {
      console.log(err);
    });
});
// finding all blogs
app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 }) // newest to the holdest.
    .then((results) => {
      res.render("index", { title: "All Blogs", blogs: results });
    })
    .catch((err) => console.log(err));
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "contact" });
});

app.get("/about", (req, res) => {
  // res.sendFile("./views/about.html", { root: __dirname });

  res.render("about", { title: "About" });
});

app.get("/blogs/create", (req, res) => {
  // res.sendFile("./views/about.html", { root: __dirname });

  res.render("creatblog", { title: "create Blog" });
});

//  /redirecting  in express
// res.redirect(<path to g to>)

// 404 age -> in case ther's no match
app.use((req, res) => {
  // res.sendFile("./views/404.html", { root: __dirname }); //root specify where it should look
  res.status(404).render("404", { title: "404" });
});
