const express = require('express');
import expressAsyncHandler from "express-async-handler";
import authMid from "../middlewares/auth.mid";
import { CartModel } from "../models/cart.model";
import { HTTP_BAD_REQUEST, HTTP_GOOD_REQUEST } from "../constants/http_status";
import { OrderStatus } from "../constants/order.status";
const router = express.Router();
router.use(authMid);

router.post('/create', expressAsyncHandler(
  async  (req:any, res:any) => {
    const cart = req.body;
    console.log('cart in backend',cart);
    
    
    if (cart.items.length <= 0) {
        res.status(HTTP_BAD_REQUEST).send('Cart Is Empty!');
        return;
    }

    await CartModel.deleteOne({
        user: req.user.id,
        status: OrderStatus.NEW
    });

    const newCart = new CartModel({ ...cart, user: req.user.id });
    await newCart.save();
    res.send(newCart);
})
) 

router.get('/currentUserCart', expressAsyncHandler(
    async  (req:any, res:any) => {
      const currentCart=  await CartModel.findOne({user: req.user.id,status: OrderStatus.NEW});
      if(currentCart){
        res.status(HTTP_GOOD_REQUEST).send(currentCart);
      }
      else{
        res.status(HTTP_BAD_REQUEST).send('Failed to fetch carts')
      }
  })
  ) 
// DELETE API to remove an item from a cart
router.delete('/deleteFood/:foodId/:cartId', expressAsyncHandler(
  async (req: any, res: any) => {
    const {foodId,cartId } = req.params;

    try {
      // Find the cart by ID
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        return res.status(404).send({ message: 'Cart not found' });
      }

      // Find the item by ID and remove it
      const itemIndex = cart.items.findIndex((item: any) => item._id.toString() === foodId);

      // if (itemIndex === -1) {
      //   return res.status(404).send({ message: 'Item not found in cart' });
      // }

      cart.items.splice(itemIndex, 1);

      // Recalculate the total price and count
      cart.totalPrice = cart.items.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
      cart.totalCount = cart.items.reduce((count: number, item: any) => count + item.quantity, 0);

      // Save the updated cart
      await cart.save();

      res.send(cart);
    } catch (error) {
      res.status(500).send({ message: 'Error removing item from cart', error });
    }
  }
));


export default router;