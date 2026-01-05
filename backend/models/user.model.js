import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLenght: 6
    },
    profilePic: {
        type: String,
        default: ''
    }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        return this.password = await bcrypt.hash(this.password, 10);
    }
    return;
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, email: this.email, fullName: this.fullName },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    return token;
}

const User = mongoose.model("User", userSchema);
export default User;