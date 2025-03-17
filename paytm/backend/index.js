const express = require ('express');
const app = express();
const { userRouter } = require('./Routes/userRouters');
const { accountRouter } = require('./Routes/accountRouters');
const cors = require('cors');



app.use(cors());
app.use(express.json());


app.use("/api/v1/user/", userRouter);
app.use("/api/v1/account/", accountRouter)

app.listen(3000, (req, res) => {
    console.log("listening");
})