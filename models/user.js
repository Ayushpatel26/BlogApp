const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        salt: {
            type: String,
        },
        password: {
            type: String,
            require: true,
        },
        profileImage: {
            type: String,
            default: "/images/user.png",
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin"],
        },
    },
    { timestamps: true }
);

userSchema.pre("save", function (next) {
    const user = this;
    
    if (!user.isModified("password")) return;

    // salt is a random string
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const userMila = await this.findOne({ email });
    if (!userMila) throw new Error("User nahi mila");

    const namak = userMila.salt;
    const hashPass = userMila.password;

    const userProvidedHash = createHmac("sha256", namak).update(password).digest("hex");

    if (hashPass !== userProvidedHash) {
        throw new Error("Incorrect password");
    }

    const token = createTokenForUser(userMila);
    return token;
})

const userwa = model("user", userSchema);

module.exports = userwa;