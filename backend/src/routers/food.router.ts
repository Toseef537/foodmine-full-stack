import { Router } from "express";
import { sample_food, sample_tags } from "../data";
import expressAsyncHandler from "express-async-handler";
import { FoodModel, foodSchema } from "../models/food.model";
import { UserModel } from "../models/user.model";
const router = Router();


router.get('/seed', expressAsyncHandler(
    async (req, res) => {
        const foodCount = await FoodModel.countDocuments();
        if (foodCount > 0) {
            res.send("seed is already done")
            return;
        }
        await FoodModel.create(sample_food);
        res.send("seed is  done")
    })
)

router.post('/add-food', expressAsyncHandler(
    async (req, res) => {
        const newFood = {
            name: req.body.name,
            price: req.body.price,
            tag: req.body.tag,
            imgUrl: req.body.imgUrl,
            cookTime: req.body.cookTime
        };
        const createdFood = await FoodModel.create(newFood);
        res.status(201).send(createdFood);
    }
));

/**
 * Getting All Foods 
 */
router.get('/', expressAsyncHandler(
    async (req, res) => {
        const foods = await FoodModel.find();
        res.send(foods);

    })
)

router.get('/search/:searchTerm', expressAsyncHandler(
    async (req, res) => {
        const searchRegex = new RegExp(req.params.searchTerm, 'i')
        const searchedFoods = await FoodModel.find({ name: { $regex: searchRegex } })
        res.send(searchedFoods);

    }
))
router.get('/tags', expressAsyncHandler(
    async (req, res) => {
        const tags = await FoodModel.aggregate([
            { $unwind: '$tags' },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: '$count'
                }
            }
        ]).sort({ count: -1 })
        const all = {
            name: 'all',
            count: await FoodModel.countDocuments()
        }
        tags.unshift(all);
        res.send(tags);

    }))
router.get('/tag/:tagName', expressAsyncHandler(
    async (req, res) => {
        const foodByTag = await FoodModel.find({ tags: req.params.tagName })
        res.send(foodByTag);

    }
))

router.get('/:foodId', expressAsyncHandler(
    async (req, res) => {
        const foodById = await FoodModel.findById(req.params.foodId);
        res.send(foodById);
    })

)


/**
 * Food Crud Operations
 */
router.delete('/delete/:foodId', expressAsyncHandler(
    async (req, res) => {
        const foodId = req.params.foodId;
        console.log('food id is', foodId);

        const deletedFood = await FoodModel.findByIdAndDelete(foodId);
        if (!deletedFood) {
            res.status(400).send({ message: 'Food Not Found' });
            return;
        }
        res.status(200).send(deletedFood);



    }
))

router.put('/update/:foodId', expressAsyncHandler(
    async (req, res) => {
        const foodId = req.params.foodId;
        const food = req.body;
        console.log('food id is', foodId);
        console.log('food data is', food);
        

        const updatedFood = await FoodModel.findByIdAndUpdate(foodId, food, {
            new: true, // Return the updated document
            runValidators: true, // Ensure that validation rules are applied
        });
        // if (!updatedFood) {
        //     res.status(400).send({ message: 'Food Not Found' });
        //     return;
        // }
        res.status(200).send(updatedFood);



    }
))

export default router;