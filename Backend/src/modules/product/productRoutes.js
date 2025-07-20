import express from "express";
import {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteAllProducts,
    deleteProduct,
} from "./productControllers.js";

import { verifyToken } from "../../middleware/verifyToken.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", verifyToken, isAdmin, addProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.delete("/", verifyToken, isAdmin, deleteAllProducts);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;
