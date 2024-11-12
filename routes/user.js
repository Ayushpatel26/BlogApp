const { Router } = require("express");
const user = require("../models/user");

const routerwa = Router();

routerwa.get("/signin", (req, res) => {
    return res.render("signin");
})
routerwa.get("/signup", (req, res) => {
    return res.render("signup");
})
routerwa.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (user.findOne(email)) {
        console.log("phle hai");
        return res.render("signup", {
            error: "User already exists",
        });
    };
    await user.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
})
routerwa.post("/signin", async (req, res) => {
    const { email, password } = req.body; console.log(email, password);
    try {//because the below function can throw error
        const token = await user.matchPasswordAndGenerateToken(email, password);
        
        return res.cookie("biscuit", token).redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "incorrect email or password",
        });
    }
});
routerwa.get("/logout", (req, res) => {
    res.clearCookie("biscuit").redirect("/");
})

module.exports = routerwa;