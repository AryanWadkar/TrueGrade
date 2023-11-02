//Init imports
import * as express from 'express';
import { Response,Request } from 'express';
const cors = require("cors");
const app= express();
require('dotenv').config();

//Local Imports
const InitMongoServer = require("./config/db");
const MentorAPIs=require("./routes/mentorApis");
const DevAPIs=require("./routes/devApis");
const middleWare = require("./config/validationmiddleware");

//Startup declarations
InitMongoServer();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());


app.get("/", (req:Request, res:Response) => {
    try{
        res.status(200).send({message:"Server is now functional"});
    }catch(err){
        res.status(500).send({message:"Server error!",data:String(err)});
    }
});

app.use("/mentor",MentorAPIs)
app.use("/dev",DevAPIs)

app.use(middleWare.validationErrorMiddleware);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});