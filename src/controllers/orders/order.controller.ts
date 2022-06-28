// import { PrismaClient } from "@prisma/client";
import mongo from "../../database/mongo";
import { Request, Response } from "express";
import { CancelOrderInput, PlaceOrderInput } from "../../schemas/order.schema";
import { UserAuthSession } from "../../schemas/user.schema";
import { Locals } from "../interfaces/locals.interface";

const OrderStatus = {
    Placed: 'Placed',
    Cancelled: 'Cancelled'
}

// const prisma=new PrismaClient();
export async function placeOrder(req: Request<{}, {}, PlaceOrderInput['body']>, res: Response<{}, Locals<UserAuthSession>>) {
    try {
        console.log('placeOrder')
        const order = await mongo.order.insertOne({
            // data:{
            productId: req.body.productId,
            userId: res.locals.user.id,
            status: OrderStatus.Placed
            // },
            // select:{
            //     id: true,
            //     createdAt: true,
            //     product: true,
            //     productId: true,
            //     userId: true
            // }
        });

        res.status(201).json({
            status: "Success",
            data: order
        })
    } catch (error) {
        res.status(200).json({
            status: "Failed",
            error: error
        });
    }
}

export async function getOrders(req: Request, res: Response<{}, Locals<UserAuthSession>>) {
    try {
        let orders = await mongo.order.find({
            userId: res.locals.user.id
        }).toArray();

        orders = await Promise.all(orders.map(async order => {
            const product = await mongo.product.findOne({
                id: order.productId
            });
            return {
                ...order,
                product: product
            };
        }))

        res.status(200).json({
            status: "Success",
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error
        })
    }
}

export async function cancelOrder(req: Request<{}, {}, CancelOrderInput['body']>, res: Response<{}, Locals<UserAuthSession>>) {
    try {
        const order = await mongo.order.findOneAndUpdate({
            productId: req.body.orderId,
            status: OrderStatus.Placed
        }, {
            $set: {
                status: OrderStatus.Cancelled
            }
        })

        if (order == null || order?.lastErrorObject?.updatedExisting == false) {
            res.status(404).json({
                status: "Failed",
                error: "Order Not Found"
            });
            return;
        }


        res.status(200).json({
            status: "Success",
            data: order
        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error
        })
    }
}