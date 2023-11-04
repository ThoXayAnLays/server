const e = require('express');
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        image1 :{ type: String, required: true },
        image2 :{ type: String, required: true },
        image3 :{ type: String, required: true },
        // size: [
        //     {
        //         sizeType: { type: String, required: true , enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']},
        //         countInStock: { type: Number, required: true }
        //     },
        // ],
        sizeXS: { type: Number, required: true },
        sizeS: { type: Number, required: true },
        sizeM: { type: Number, required: true },
        sizeL: { type: Number, required: true },
        sizeXL: { type: Number, required: true },
        sizeXXL: { type: Number, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        // countInStock: { type: Number, required: true },
        rating: { type: Number },
        description: { type: String },
        discount: { type: Number },
        selled: { type: Number }
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
