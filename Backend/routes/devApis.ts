import * as express from 'express';
import { Response,Request } from 'express';
import { Validator} from "express-json-validator-middleware";
require('dotenv').config();
const router = express.Router();
const StudentModel = require("../models/student");
const MentorModel = require("../models/mentor")
const { validate } = new Validator({});
const validJson = require("../config/schema");
const jwt = require("jsonwebtoken");


router.post("/insertStudent",async(req:Request,res:Response)=>{
    const mentorid=req.body.mentorid || "";
    try{
        const cnt= await StudentModel.countDocuments({});
        let newStudent = new StudentModel({
            name:`Student ${cnt+1}`,
            email:`student${cnt+1}@truegradestudent.com`,
            marks:{
                    lock:false,
                    mentorID:mentorid,
                    score:{
                    }
                }
            
        });
        await newStudent.save();
        res.status(200).send({message:"added sucesfully",data:newStudent})
    }catch(err){
        res.status(500).send({data:String(err)})
    }
});

router.post("/insertMentor",async(req:Request,res:Response)=>{
    
    try{
        const cnt= await MentorModel.countDocuments({});
        let newMentor = new MentorModel({
            name:`Mentor ${cnt+1}`,
            email:`mentor${cnt+1}@truegradestudent.com`,
        });
        await newMentor.save();
        res.status(200).send({message:"added sucesfully",data:newMentor})
    }catch(err){
        res.status(500).send({data:String(err)})
    }
});

router.get("/allstudents",async(req:Request,res:Response)=>{
    try{
        const students= await StudentModel.find({});
        res.status(200).send({message:"fetched",data:students})
    }catch(err){
        res.status(500).send({data:String(err)})
    }
});

router.get("/allmentors",async(req:Request,res:Response)=>{
    try{
        const mentors= await MentorModel.find({});
        res.status(200).send({message:"fetched",data:mentors})
    }catch(err){
        res.status(500).send({data:String(err)})
    }
});

router.post("/fetchtoken",validate({ body: validJson.mentorOnlySchema }),async(req:Request,res:Response)=>{
    try{
        const mentorDoc=await MentorModel.findOne({_id:req.body.mentorID});
        if(mentorDoc)
        {
            const payload = {
                "mentorID":req.body.mentorID,
                "purpose":"ops",
                "access":"mentor"
            };
    
            const tokenSigned = jwt.sign(
                payload,
                process.env.JWTENC,
                {}
            );
            res.status(200).send({data:tokenSigned});
        }else{
            res.status(400).send({message:"Mentor not found"});
        }

    }catch(err){
        res.status(500).send({message:String(err)})
    }
})

module.exports = router;