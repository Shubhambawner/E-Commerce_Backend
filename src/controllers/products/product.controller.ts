// import { PrismaClient } from "@prisma/client";
import mongo from "../../database/mongo";
import { Request, Response } from "express";
import { SearchProductInput, ProductInput } from "../../schemas/product.schema";
import { UserAuthSession, UserModel } from "../../schemas/user.schema";
import { Locals } from "../interfaces/locals.interface";

// const prisma=new PrismaClient();

export async function searchProducts(req: Request<{}, {}, SearchProductInput['body']>, res: Response<{}, Locals<UserAuthSession> >) {
    try {
        const products=await mongo.product.find({
                title:{
                    $regex: req.body.title
                }
        }).toArray()

        res.status(200).json({
            status:"Success",
            data: products
        });
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            error: error
        })
    }
}

export async function getProducts(req: Request<{}, {}, SearchProductInput['body']>, res: Response<{}, Locals<UserAuthSession> >) {
    try {
        const products=await mongo.product.find({}).toArray();
        res.status(200).json({
            status:"Success",
            data: products
        });
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            error: error
        })
    }
}


// TODO: Add product creation
export async function uploadProducts(req: Request, res: Response<{}, Locals<UserAuthSession> >) {
    try {
        const products=await mongo.product.find({}).toArray();
        res.status(200).json({
            status:"Success",
            data: products
        });
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            error: error
        })
    }
}
