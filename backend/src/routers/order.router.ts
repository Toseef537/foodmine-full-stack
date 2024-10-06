import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderItemSchema, OrderModel } from "../models/order.model";
import { OrderStatus } from "../constants/order.status";
import authMid from "../middlewares/auth.mid";
const router = Router();
router.use(authMid);

router.post('/create',
    expressAsyncHandler(async (req: any, res: any) => {
        const requestOrder = req.body;
        console.log('requesr order',req.user);
        
        if (requestOrder.items.length <= 0) {
            res.status(HTTP_BAD_REQUEST).send('Cart Is Empty!');
            return;
        }

        await OrderModel.deleteOne({
            user: req.user.id,
            status: OrderStatus.NEW
        });

        const newOrder = new OrderModel({ ...requestOrder, user: req.user.id });
        await newOrder.save();
        res.send(newOrder);
    })
)

router.get('/newOrderForCurrentUser', expressAsyncHandler(async (req: any, res) => {
    const order = await getNewOrderForCurrentUser(req);
    if (order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).send();
}))

router.get('/allOrders', expressAsyncHandler(async (req, res) => {
    try {
        const orders = await OrderModel.find();
        res.send(orders);
    } catch (error) {
        res.status(HTTP_BAD_REQUEST).send('Failed to fetch orders');
    }
}));

async function getNewOrderForCurrentUser(req: any) {
    console.log('user id is',req.user);
    return await OrderModel.findOne({ user: req.user.id, status: OrderStatus.NEW });
}
export default router;