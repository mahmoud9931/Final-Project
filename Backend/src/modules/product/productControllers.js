import productModel from "../../../db/models/productModel.js";

export const addProduct = async (req, res) => {
    try {
        const name = req.body.name?.trim();
        const { price, stock, description, image, category } = req.body;

        const existingProduct = await productModel.findOne({ name });

        if (existingProduct) {
            existingProduct.stock += stock ?? 1;
            if (price !== undefined) existingProduct.price = price;
            if (description !== undefined)
                existingProduct.description = description;
            if (image !== undefined) existingProduct.image = image;
            if (category !== undefined) existingProduct.category = category;

            await existingProduct.save();

            return res.status(200).json({
                message: "Product already exists, stock updated",
                product: existingProduct,
            });
        }

        const newProduct = await productModel.create({
            name,
            price,
            stock,
            description,
            image,
            category,
        });

        res.status(201).json({
            message: "New product added",
            product: newProduct,
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to add product",
            error: err.message,
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.json({ message: "All products", products });
    } catch (err) {
        res.status(500).json({
            message: "Failed to get products",
            error: err.message,
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product fetched", product });
    } catch (err) {
        res.status(500).json({
            message: "Failed to get product",
            error: err.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product updated", product });
    } catch (err) {
        res.status(500).json({
            message: "Failed to update product",
            error: err.message,
        });
    }
};

export const deleteAllProducts = async (req, res) => {
    try {
        await productModel.deleteMany({});
        res.json({ message: "All products deleted successfully" });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete products",
            error: err.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findByIdAndDelete(id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted", product });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete product",
            error: err.message,
        });
    }
};
