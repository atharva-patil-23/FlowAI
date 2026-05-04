import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { sendWelcome } from "../lib/email.js";

const signToken = (user) =>
    jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

export const signup = asyncHandler(async (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;

    const existing = await User.findOne({ email }).lean();
    if (existing) {
        return res
            .status(409)
            .json({ success: false, error: { message: "Email already in use" } });
    }

    const user = await User.create({ username, firstName, lastName, email, password });
    const token = signToken(user);

    sendWelcome(user).catch((err) => console.error("[email] welcome failed:", err.message));

    res.status(201).json({
        success: true,
        data: { user: user.toClient(), token },
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res
            .status(401)
            .json({ success: false, error: { message: "Invalid credentials" } });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
        return res
            .status(401)
            .json({ success: false, error: { message: "Invalid credentials" } });
    }

    user.lastActive = new Date();
    await user.save();

    const token = signToken(user);
    res.json({ success: true, data: { user: user.toClient(), token } });
});

export const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: { message: "User not found" } });
    }
    res.json({ success: true, data: { user: user.toClient() } });
});

export const updatePreferences = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: { message: "User not found" } });
    }
    const { aiSuggestion, notifications } = req.body;
    if (typeof aiSuggestion === "boolean") user.preferences.aiSuggestion = aiSuggestion;
    if (typeof notifications === "boolean") user.preferences.notifications = notifications;
    await user.save();
    res.json({ success: true, data: { user: user.toClient() } });
});
