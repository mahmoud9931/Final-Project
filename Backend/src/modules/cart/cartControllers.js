import cartModel from "../../../db/models/cartModel.js";

export const getCart = async (req, res) => {
    try {
        const cart = await cartModel
            .findOne({ user: req.user._id })
            .populate("items.product");
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        res.json({ message: "Cart fetched", cart });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch cart",
            error: err.message,
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        let cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            cart = await cartModel.create({
                user: req.user._id,
                items: [{ product, quantity }],
            });
        } else {
            const existingItem = cart.items.find(
                (item) => item.product.toString() === product
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product, quantity });
            }

            await cart.save();
        }

        res.json({ message: "Product added to cart", cart });
    } catch (err) {
        res.status(500).json({
            message: "Failed to add to cart",
            error: err.message,
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();
        res.json({ message: "Product removed", cart });
    } catch (err) {
        res.status(500).json({
            message: "Failed to remove product",
            error: err.message,
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await cartModel.findOneAndUpdate(
            { user: req.user._id },
            { items: [] },
            { new: true }
        );

        res.json({ message: "Cart cleared", cart });
    } catch (err) {
        res.status(500).json({
            message: "Failed to clear cart",
            error: err.message,
        });
    }
};
