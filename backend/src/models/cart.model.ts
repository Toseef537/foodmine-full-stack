import { model, Schema, Types } from 'mongoose';
import { Food, foodSchema } from './food.model';
import { OrderStatus } from '../constants/order.status';

export interface cartItem {
    food: Food;
    price: number;
    quantity: number;
}

export const cartItemSchema = new Schema<cartItem>(
    {
        food: { type: foodSchema, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }
);

export interface Cart {
    id: string;
    items: cartItem[];
    totalPrice: number;
    totalCount: number;
    user: Types.ObjectId;
    status: OrderStatus;
}

const cartSchema = new Schema<Cart>({
    totalPrice: { type: Number, required: true },
    totalCount: { type: Number, required: true },
    items: { type: [cartItemSchema], required: true },
    user: { type: Schema.Types.ObjectId, required: true },
    status: {type: String, default: OrderStatus.NEW},
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

export const CartModel = model('cart', cartSchema);