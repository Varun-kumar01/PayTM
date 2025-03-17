const zod = require('zod');

const userSignUpSchema = zod.object({
    userName:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string(),
})

const userSigninSchema = zod.object({
    userName:zod.string().email(),
    password:zod.string(),
})

const userUpdateSchema = zod.object({
    firstName:zod.string().optional(),
    lastName:zod.string().optional(),
    password:zod.string().optional()
})


module.exports = {
    userSignUpSchema,
    userSigninSchema,
    userUpdateSchema
}