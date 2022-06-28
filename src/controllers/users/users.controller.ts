import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from "mongodb";
import { any } from "zod";
// import { PrismaClient } from '@prisma/client';
import mongo from "../../database/mongo";
import { CreateUserInput, UserLoginInput } from "../../schemas/user.schema";
import { AUTHORIZATION_TOKEN, generateToken } from "../../utils/tokenUtils";

// const prisma = new PrismaClient()
export const userSignUp = async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    try {

        const user = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            id: uuidv4()
        }
        const dbReq = await mongo.user.insertOne(user)
        console.log(dbReq)
        if(!dbReq.acknowledged) throw "DB error: Failed to create user"

        const authToken = generateToken(user.id, user.email);
        const respData: any = {
            message: "User Created Successfully...!",
            data: user
        };
        respData[AUTHORIZATION_TOKEN] = authToken;
        res.status(201).json({
            status: "sucess",
            ...respData
        });
    } catch (error: any) {
        console.log(error)
        if(error.code === 11000){error={};error.message = "email ID already exists"; error.code = 400; error.status="failed"}
        res.status(500).json({
            status: "failed",
            error: (error)
        });
    }
}

export const userLogin = async (req: Request<{}, {}, UserLoginInput['body']>, res: Response) => {
    try {
        const user = await mongo.user.findOne({
                email: req.body.email
        });

        console.log(user)

        if (user == null) {
            res.status(404).json({
                status: "Failed",
                error: 'User not found.'
            });
            return;
        }

        if (user.password != req.body.password) {
            res.status(405).json({
                status: "Failed",
                error: 'Invalid email or password.'
            });
            return;
        }

        const authToken = generateToken(user.id, user.email);
        const respData: any = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
        };
        respData[AUTHORIZATION_TOKEN] = authToken;
        res.status(200).json({
            status: "Success",
            ...respData,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Failed",
            error: error
        });
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await mongo.user.find({
            // select: {
                id: true,
                email: true,
                name: true
            // }
        }).toArray();
        res.status(200).json({
            status: "success",
            data: users,
            message: "User Successfully Fetched.. !"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Failed",
            error: error
        })
    }
}