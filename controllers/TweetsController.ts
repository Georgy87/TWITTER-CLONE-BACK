import express from "express";
import { validationResult } from "express-validator";
import { TweetModel, TweetModelInterface } from "../models/TweetModel";
import { UserModelInterface } from "../models/UserModel";
import { isValidObjectId } from "../utils/isValidObjectId";

class TweetsController {
    async index(_: any, res: express.Response): Promise<void> {
        try {
            const tweets = await TweetModel.find({}).populate('user').sort({ 'createdAt': '-1' }).exec();

            res.json({
                status: "success",
                data: tweets,
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error,
            });
        }
    }

    async show(req: any, res: express.Response): Promise<void> {
        try {
            const tweetId = req.params.id;
            console.log(tweetId);
            if (!isValidObjectId(tweetId)) {
                res.status(400).send();
                return;
            }

            const tweet = await TweetModel.findById(tweetId)
                .populate("user")
                .sort({ createdAt: -1 })
                .exec();

            if (!tweet) {
                res.status(404).send();
                return;
            }
            console.log(tweet);

            res.json({
                status: "success",
                data: tweet,
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error,
            });
        }
    }

    async create(req: any, res: express.Response): Promise<void> {
        const user = req.user as UserModelInterface;
        try {
            if (user?._id) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        status: "error",
                        errors: errors.array(),
                    });
                    return;
                }

                const data: TweetModelInterface = {
                    text: req.body.text,
                    user: user._id,
                };

                const tweet = await TweetModel.create(data);
                res.json({
                    status: "success",
                    data: await tweet.populate('user').execPopulate(),
                });
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: JSON.stringify(error),
            });
        }
    }

    async delete(req: any, res: express.Response): Promise<void> {
        const user = req.user as UserModelInterface;
        try {
            if (user) {
                const tweetId = req.params.id;

                if (!isValidObjectId(tweetId)) {
                    res.status(400).send();
                    return;
                }

                const tweet = await TweetModel.findById(tweetId);

                if (tweet) {
                    console.log(tweet.user, user._id);
                    if (String(tweet.user) === String(user._id)) {
                        tweet.remove();
                        res.send();
                    } else {
                        res.status(400).send();
                    }
                } else {
                    res.status(404).send();
                }
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error,
            });
        }
    }

    async update(req: any, res: express.Response): Promise<void> {
        const user = req.user as UserModelInterface;
        try {
            if (user) {
                const tweetId = req.params.id;
                const text = req.body.text;

                if (!isValidObjectId(tweetId)) {
                    res.status(400).send();
                    return;
                }

                const tweet = await TweetModel.findById(tweetId);

                if (tweet) {
                    console.log(text);
                    if (String(tweet.user) === String(user._id)) {
                        tweet.text = text;
                        tweet.save();
                        res.send();
                    } else {
                        res.status(400).send();
                    }
                } else {
                    res.status(404).send();
                }
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error,
            });
        }
    }
}

export const TweetsCtrl = new TweetsController();
