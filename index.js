const exp = require("express");
const rasta = require("path");
const mongo = require("mongoose");
const biscuitParser = require("cookie-parser");

const blogwa = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = exp();
const port = 8000;

mongo.connect("mongodb://localhost:27017/blogify").then(()=>{console.log("mongodb connected");
})

app.set("view engine", "ejs");
app.set("views", rasta.resolve("./views"));

// Middlewares
app.use(exp.urlencoded({ extended: false }));
app.use(biscuitParser());
app.use(checkForAuthenticationCookie("biscuit"));
app.use(exp.static(rasta.resolve("./public")));

// Routes
app.get("/", async (req, res) => {
    const allBlogs = await blogwa.find({});
    res.render("home", {
        user: req.user,//user object
        blogs: allBlogs,
    });
})

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(port, () => console.log("Server Started at port:", port));