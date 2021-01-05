import { body } from "express-validator";

export const tweetsValidations = [
    body("text", "Введите текст твита")
        .isString()
        .isLength({
            min: 10,
            max: 280,
        })
        .withMessage("Максимальная длина твита 280 символов"),
];
