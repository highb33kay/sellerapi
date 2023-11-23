// orderItemsController.js
const { client } = require("../db/mongo");
const {
  NotFoundError,
  BadRequestError,
} = require("../middlewares/errorhandler");

const { ResponseHandler } = require("../middlewares/response");

const myDB = client.db("olist");

async function getProductCategoryName(product_id) {
  const productsCollection = myDB.collection("olist_products_dataset");

  try {
    const product = await productsCollection.findOne({
      product_id: product_id,
    });

    console.log(product.product_category_name, "product");

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product.product_category_name;
  } catch (error) {
    console.error("Invalid product_id:", error);
    return null;
  }
}

async function getOrderItems(req, res, next) {
  const orderItemsCollection = myDB.collection("olist_order_items_dataset");

  if (!req.seller) {
    return next(new BadRequestError("Seller not found"));
  }

  const { sort = "shipping_limit_date", limit = 20, offset = 0 } = req.query;
  const userID = req.seller.seller_id;

  try {
    const orderItems = await orderItemsCollection
      .find({ seller_id: userID })
      .sort({ [sort]: 1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();

    if (!orderItems || orderItems.length === 0) {
      throw new NotFoundError("User has no items");
    }

    const productIds = orderItems.map((item) => item.product_id);

    const orderItemsWithCategory = await Promise.all(
      orderItems.map(async (item) => {
        const productCategory = await getProductCategoryName(item.product_id);

        return {
          id: item._id,
          product_id: item.product_id,
          product_category: productCategory,
          price: item.price,
          date: item.shipping_limit_date,
        };
      })
    );

    ResponseHandler.success(
      res,
      {
        data: orderItemsWithCategory,
        total: orderItems.length,
        limit: Number(limit),
        offset: Number(offset),
      },
      200,
      "Order items retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching order items:", error);
    next(error);
  }
}

async function deleteOrderItem(req, res, next) {
  const orderItemsCollection = myDB.collection("olist_order_items_dataset");

  const { id } = req.params;

  try {
    const result = await orderItemsCollection.deleteOne({ order_id: id });

    if (result.deletedCount > 0) {
      ResponseHandler.success(
        res,
        null,
        204,
        "Order item deleted successfully"
      );
    } else {
      throw new NotFoundError("Order item not found");
    }
  } catch (error) {
    console.error("Error deleting order item:", error);
    next(error);
  }
}

module.exports = { getOrderItems, deleteOrderItem };
