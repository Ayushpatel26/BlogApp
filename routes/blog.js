const Router = require("express");
const multer = require("multer");
const rasta = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const routerwa = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, rasta.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

routerwa.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
});
routerwa.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");console.log("blog->", blog);
    // const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");console.log("comments-->",comments);
    
    return res.render("blog", {
        user: req.user,
        blog,
        // comments,
    });
});
routerwa.post("/", upload.single("coverImage"), (req, res) => {
    const { title, body } = req.body;
    const blog = Blog.create({
        title,
        body,
        createdBy: req.user._id,
        blogCover: `uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
});
routerwa.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports = routerwa;