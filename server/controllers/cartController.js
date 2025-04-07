const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');


//add item to cart controller
exports.addItemCartController = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const { userId } = req.params; // Extract userId from URL parameters
    
        // Check if the product data is valid
        if (!product || !product._id || !product.name || !product.price) {
          return res.status(400).json({ message: 'Invalid product data' });
        }
    
        // Check if the cart already exists for the user
        let cart = await cartModel.findOne({ userId });
    
        // If no cart exists, create a new cart
        if (!cart) {
          cart = new cartModel({
            userId,
            items: [{ product, quantity }],
          });
        } else {
          // If cart exists, check if the product is already in the cart
          const existingItem = cart.items.find(item => item.product._id.toString() === product._id.toString());
    
          if (existingItem) {
            // If product exists, update the quantity
            existingItem.quantity += quantity;
          } else {
            // Otherwise, add the new product to the cart
            cart.items.push({ product, quantity });
          }
        }
    
        // Save the cart
        await cart.save();
    console.log(cart);
        return res.status(200).json({ message: 'Product added to cart successfully', cart });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    };
    
    // Remove item from cart controller
    exports.deleteItemCartController = async (req, res) => {

        try {
            const { userId, productId } = req.params;  // Get userId and productId from request parameters
        
            // Find the cart for the user
            let cart = await cartModel.findOne({ userId });
        
            // If no cart is found for the user, return a 404 error
            if (!cart) {
              return res.status(404).json({ success: false, message: 'Cart not found' });
            }
        
            // Check if the product exists in the cart
            const existingItemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);
        
            // If product is not found in the cart, return a 404 error
            if (existingItemIndex === -1) {
              return res.status(404).json({ success: false, message: 'Product not found in the cart' });
            }
        
            // Remove the item from the cart (by index)
            cart.items.splice(existingItemIndex, 1);
        
            // Save the updated cart to the database
            await cart.save();
        
            // Return a success response
            res.status(200).json({ success: true, message: 'Item removed from cart', cart });
          } catch (error) {
            console.error('Error in removeItemCartController:', error);
            res.status(500).json({ success: false, message: 'Server error' });
          }
        };


// calculating total price of cart controller -
        exports.getTotalCartController = async (req, res) => {
            try {
                const { userId } = req.params;  // Extract userId from request parameters
            
                // Find the cart for the user, populating the product's price and name
                const cart = await cartModel
                  .findOne({ userId })
                  .populate('items.product', 'price name');  // Ensure we're fetching 'price' and 'name' for product
            
                // If no cart found, return a 404 error
                if (!cart) {
                  return res.status(404).json({ success: false, message: 'Cart not found' });
                }
            
                // Debugging: Log the cart and items to check if price and quantity are correct
                console.log('Cart:', cart);
            
                // Calculate the total price
                let total = 0;
                cart.items.forEach(item => {
                  // Log each product and its quantity
                  console.log('Product:', item.product);
                  console.log('Quantity:', item.quantity);
            
                  if (item.product && item.product.price) {
                    total += item.product.price * item.quantity;  // Multiply the price of the product by the quantity
                  }
                });
            
                // Return the total price
                res.status(200).json({
                  success: true,
                  message: 'Total price calculated',
                  total: total
                });
              } catch (error) {
                console.error('Error in getTotalCartController:', error);
                res.status(500).json({ success: false, message: 'Server error' });
              }
            };



            //syncing cart controller where when user , add-remove items from the cart the cart will get change and sync with the actions of adding and removing
            exports.syncCartController = async (req, res) => {
              try {
                const { userId } = req.params;      // Get userId from URL parameters
                const { items } = req.body;          // Expecting items to be an array of { product, quantity }
            
                // Validate that items is provided and is an array
                if (!items || !Array.isArray(items)) {
                  return res.status(400).json({ message: 'Invalid cart items data. Expected an array of items.' });
                }
            
                // Find the cart for the user
                let cart = await cartModel.findOne({ userId });
            
                if (!cart) {
                  // If no cart exists, create a new one with the provided items
                  cart = new cartModel({
                    userId,
                    items: items
                  });
                } else {
                  // If cart exists, update its items with the new data
                  cart.items = items;
                }
            
                // Save the updated cart
                await cart.save();
            
                console.log('Synced Cart:', cart);
                return res.status(200).json({ message: 'Cart synced successfully', cart });
              } catch (error) {
                console.error('Error in syncCartController:', error);
                return res.status(500).json({ message: 'Internal server error' });
              }
            };


            // Get all carts
exports.getAllCartsController = async (req, res) => {
  try {
      const carts = await cartModel.find().populate('items.product', 'name price'); // Populating product details
      res.status(200).json({ success: true, message: "All carts fetched", carts });
  } catch (error) {
      console.error("Error in getAllCartsController:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a specific user's cart
exports.getUserCartController = async (req, res) => {
  try {
      const { userId } = req.params;
      const cart = await cartModel.findOne({ userId }).populate('items.product', 'name price');

      if (!cart) {
          return res.status(404).json({ success: false, message: "Cart not found" });
      }

      res.status(200).json({ success: true, message: "User cart fetched", cart });
  } catch (error) {
      console.error("Error in getUserCartController:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};








































































    //   try {
    //     const { userId, productId } = req.params;
    
    //     // Find the cart for the user
    //     let cart = await cartModel.findOne({ userId });
        
    //     if (!cart) {
    //       return res.status(404).json({ success: false, message: 'Cart not found' });
    //     }
    
    //     // Filter out the item to remove
    //     cart.items = cart.items.filter(item => item.product.toString() !== productId);
    
    //     // Save updated cart
    //     await cart.save();
    //     res.json({ success: true, message: 'Item removed from cart', cart });
    //   } catch (error) {
    //     console.error('Error in deleteItemCartController:', error);
    //     res.status(500).json({ success: false, message: 'Server error' });
    //   }
    // };

    // try {
    //     const { userId } = req.params;
    //     const { cartItem } = req.body; // cartItem contains product details and quantity
    
    //     if (!cartItem || !cartItem.product || !cartItem.quantity) {
    //       return res.status(400).json({ success: false, message: 'Invalid cart item data' });
    //     }
    
    //     let cart = await cartModel.findOne({ userId });
    
    //     if (!cart) {
    //       // Create a new cart with the provided product details
    //       cart = new cartModel({ userId, items: [cartItem] });
    //     } else {
    //       // Check if the product already exists in the cart
    //       const itemIndex = cart.items.findIndex(item => item.product._id.toString() === cartItem.product._id);
    
    //       if (itemIndex > -1) {
    //         // Update quantity if product exists
    //         cart.items[itemIndex].quantity += cartItem.quantity;
    //       } else {
    //         // Add new product to cart
    //         cart.items.push(cartItem);
    //       }
    //     }
    
    //     await cart.save();
    //     console.log("Cart saved successfully:", cart);
    //     res.json({ success: true, message: "Item added to cart", cart });
    
    //   } catch (error) {
    //     console.error("Error in addItemCartController:", error);
    //     res.status(500).json({ success: false, message: "Server error" });
    //   }
    // };
  
//------------ sample data to check upper controller which is wokring but not saving the data in the database

// {
//     "cartItem": {
//       "product": {
//         "_id": "67ed2a287d127e5739dcc46c",  
//         "name": "Product 1",
//         "price": 100,
//         "description": "Description of Product 1",
//         "category": "Category 1",
//         "stock": 10
//       },
//       "quantity": 2
//     }
//   }
  


    //-----------------------------------------------------
// remove item from cart controller

// exports.deleteItemCartController = async (req, res) => {
//     try {
//         const { userId, productId } = req.params; // Get userId and productId from URL

//         // Find the cart for the user
//         let cart = await cartModel.findOne({ userId });

//         if (!cart) {
//             return res.status(404).json({ message: "Cart not found" });
//         }

//         // Filter out the item to be removed
//         cart.items = cart.items.filter(item => item.productId !== productId);

//         // Save updated cart
//         await cart.save();

//         res.json({ message: "Item removed from cart", cart });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };











// for testing of additemcartcontroller 
// i used this url in postman - http://localhost:5000/api/cart/add/1005/p006
// we need to put userid and product id and then the item will be saved in the cart item array which itself is an schema 


// for testing of removeitemcartcontroller
// i used this url in postman - 