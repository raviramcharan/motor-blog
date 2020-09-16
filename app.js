var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');

mongoose.connect("mongodb://localhost/motor_blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//SCHEMA CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

// MONGOOSE MODEL CONFIG
var Blog = mongoose.model("Blog", blogSchema);

// //CREATE BLOG POST
// Blog.create({
//   title: "Kawasaki ER-5",
//   image:
//     "https://storage.kawasaki.eu/public/kawasaki.eu/en-EU/model/imported/D0000000B630DD0884.jpg",
//   body:
//     "De ER-5 is nog steeds een redelijk geziene motor op de Nederlandse en Europese wegen, en hier en daar nog steeds te vinden als lesmotor bij rijscholen door het land, al is deze (begrijpelijk) wel steeds vaker vervangen door een recenter model. Eigenlijk was de ER-5 een laatkomer in 1996 en waren de Suzuki GS500e (1988) en Honda CB500 (1994) al veel langer populaire lesmotoren. Kawasaki wilde dan ook concurreren met een 500cc budgetmotor tegen een scherpe prijs. Met een reeds bestaand blok, scheelde dat ontwikkelkosten en zo kon de ER-5 voor minder dan de lucht-/oliegekoelde Suzuki GS500e in de winkel worden gezet.",
// });

//ROUTES
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", (req,res) => {
  res.render("new");
})
//CREATE ROUTE
app.post("/blogs", (req,res) => {

  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.create(req.body.blog, (err, newBlog) => {
    if(err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  })
})

//SHOW ROUTE
app.get("/blogs/:id", (req,res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  })
})

//EDIT ROUTE
app.get("/blogs/:id/edit", (req,res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err) {
      console.log(err);
    } else {
        res.render("edit", {blog: foundBlog});
    }
  })
}); 

//PUT ROUTE
app.put("/blogs/:id", (req,res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  })
})

//DELETE ROUTE 
app.delete("/blogs/:id", (req,res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
      if(err) {
        res.redirect("/blogs");
      } else {
        res.redirect("/blogs")
      }
  })
})

app.listen(8081, () => {
  console.log("Server is running");
});
