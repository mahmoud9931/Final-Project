import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: String,
    price: {
        type: Number,
        required: true,
    },
    image: String,
    category: String,
    stock: {
        type: Number,
        default: 0,
    },
});

const productModel = mongoose.model("Product", productSchema);
export default productModel;
