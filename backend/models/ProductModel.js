const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a product name'],
    trim: true,
    maxLength: [25, 'Product name cannot exceed 25 characters.'],
  },
  description: {
    type: String,
    required: [true, 'Please enter a product description.'],
    maxLength: [4000, 'Description cannot exceed 4000 characters.'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter a product price.'],
    maxLength: [8, 'Price cannot exceed 8 characters.'],
  },
  discountPrice: {
    type: String,
    maxLength: [4, 'Discount price cannot exceed 4 characters.'],
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please add a category for this product.'],
  },
  Stock: {
    type: Number,
    required: [true, 'Please add the number you have in stock.'],
    maxLength: [4, 'Number in stock cannot exceed 4 characters.'],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
      time: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    //required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Product', productSchema);
