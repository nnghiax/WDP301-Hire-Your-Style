const Cart = require("../model/Cart");
const Product = require("../model/Product");

const cartController = {
  addToCart: async (req, res) => {
    try {
      const { productId, size, quantity } = req.body;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const sizeOption = product.sizes.find((s) => s === size);
      if (!sizeOption) {
        return res.status(400).json({ message: "Invalid size" });
      }

      if (quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Quantity must be greater than 0" });
      }

      if (quantity > product.quantity) {
        return res
          .status(400)
          .json({ message: "Not enough stock for this product" });
      }

      let cart = await Cart.findOne({ userId: req.userId });

      if (!cart) {
        cart = new Cart({
          userId: req.userId,
          items: [{ productId, size, quantity }],
        });
      } else {
        const existingItem = cart.items.find(
          (item) =>
            item.productId.toString() === productId && item.size === size
        );
        if (existingItem) {
          if (existingItem.quantity + quantity > product.quantity) {
            return res
              .status(400)
              .json({ message: "Not enough stock for this product" });
          }
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ productId, size, quantity });
        }
      }

      await cart.save();
      return res
        .status(201)
        .json({ message: "Add to cart successfully", cart });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  listItem: async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.userId }).populate(
        "items.productId"
      );

      if (!cart) {
        return res.status(200).json({ data: [] });
      }

      const result = cart.items.map((item) => {
        const p = item.productId;
        return {
          _id: item._id,
          name: p.name,
          image: p.image,
          price: p.price,
          size: item.size,
          quantity: item.quantity,
        };
      });

      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateQuantity: async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const { quantity } = req.body;

      if (quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Quantity must be greater than 0" });
      }

      const cart = await Cart.findOne({ userId: req.userId }).populate(
        "items.productId"
      );
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const item = cart.items.find((item) => item._id.toString() === itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      if (quantity > item.productId.quantity) {
        return res
          .status(400)
          .json({ message: "Not enough stock for this product" });
      }

      item.quantity = quantity;
      await cart.save();

      return res.status(200).json({ message: "Quantity updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteItem: async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const cart = await Cart.findOne({ userId: req.userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === itemId
      );
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      cart.items.splice(itemIndex, 1);
      await cart.save();

      return res.status(200).json({ message: "Delete item successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = cartController;
