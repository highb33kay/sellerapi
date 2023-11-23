// update Update logged in seller's city or/and state. Should return new seller city and state as response.
const { client } = require("../db/mongo");
const {
  NotFoundError,
  BadRequestError,
} = require("../middlewares/errorhandler");

const { ResponseHandler } = require("../middlewares/response");

const myDB = client.db("olist");

async function updateSellerAccount(req, res, next) {
  const sellersCollection = myDB.collection("olist_sellers_dataset"); // Adjust the collection name as needed

  try {
    if (!req.seller) {
      throw new BadRequestError("Seller not found");
    }

    const { city, state } = req.body;

    console.log(city, state, "city, state");

    if (!city && !state) {
      throw new BadRequestError("City or state must be provided for update");
    }

    const sellerId = req.seller.seller_id;

    const updateFields = {};
    if (city) {
      updateFields.seller_city = city;
    }
    if (state) {
      updateFields.seller_state = state;
    }

    const result = await sellersCollection.updateOne(
      { seller_id: sellerId },
      { $set: updateFields }
    );

    if (result.matchedCount < 1) {
      throw new NotFoundError("Seller not found");
    }

    const updatedSeller = await sellersCollection.findOne({
      seller_id: sellerId,
    });

    console.log(updatedSeller, "updatedSeller");

    const newCity = updatedSeller.seller_city;
    const newState = updatedSeller.seller_state;

    ResponseHandler.success(
      res,
      { newCity, newState },
      200,
      "Seller location updated successfully"
    );
  } catch (error) {
    console.error("Error updating seller location:", error);
    next(error);
  }
}

module.exports = { updateSellerAccount };
