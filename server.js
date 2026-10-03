const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

app.get("/", (req, res) => {
    res.json({
        message: "Product API is running"
    });
});

console.log("POST route loaded");

app.post("/api/products", async (req, res) => {
    try {
        const product = new Product(req.body);

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({
            message: "Create product failed",
            error: error.message
        });
    }
});

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Get products failed",
            error: error.message
        });
    }
});

app.get("/api/products/:pid", async (req, res) => {
    try {
        const product = await Product.findOne({
            pid: Number(req.params.pid)
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Get product failed",
            error: error.message
        });
    }
});

app.put("/api/products/:pid", async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { pid: Number(req.params.pid) },
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({
            message: "Update product failed",
            error: error.message
        });
    }
});

app.delete("/api/products/:pid", async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            pid: Number(req.params.pid)
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Delete product failed",
            error: error.message
        });
    }
});