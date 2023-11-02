import * as express from 'express';
import { Response,Request } from 'express';
import { Validator} from "express-json-validator-middleware";
require('dotenv').config();
const validJson = require("../config/schema");
const router = express.Router();
const StudentModel = require("../models/student");
const { validate } = new Validator({});
const globalServices=require("../services/globalservices")

router.get("/allstudents",async(req:Request, res:Response)=>{
    try{
        const allStudents=await StudentModel.find({});
        res.status(200).send({data:allStudents});
    }catch(err){
        res.status(500).send({data:String(err)})
    }
});

router.get("/mentees",globalServices.authenticateJWT,async(req:Request, res:Response)=>{
    const id=req.headers.mentorID;
    if(id)
    {
        try{
            const allStudents=await StudentModel.find({"marks.mentorID": id});
            res.status(200).send({data:allStudents});
        }catch(err){
            res.status(500).send({data:String(err)})
        }
    }else{
        res.status(400).send({message:"mentee ID required"})
    }

});

router.post("/addmentee",validate({ body: validJson.studentOnlySchema }),globalServices.authenticateJWT,async(req:Request, res:Response)=>{
    const mentorid=req.headers.mentorID;
    const studentid=req.body.studentID;
    try{
        const allStudents=await StudentModel.find({"marks.mentorID": mentorid});
        if(allStudents.some((obj)=>obj.marks.lock===true)){
            res.status(400).send({message:"Cannot edit group once marks are submitted"});
        }else if(allStudents.length==4){
            res.status(400).send({message:"Capacity full!"});
        }else if(allStudents.some((obj)=>obj._id==studentid)){
            res.status(400).send({message:"Student already added!"});
        }else{
            const currStudent=await StudentModel.findOne({_id:studentid});
            if(currStudent)
            {
                if(currStudent.marks.mentorID!="")
                {
                    res.status(400).send({message:"Student already in a group"});
                }else if(currStudent.marks.lock===true){
                    res.status(400).send({message:"Student marks submitted!"});
                }else{
                    await StudentModel.findOneAndUpdate({_id:studentid,"marks.mentorID": ""},{$set:{"marks.mentorID":mentorid}});
                    res.status(200).send({message:"Set sucessfully"})
                }
            }else{
                res.status(400).send({message:"Student not found"})
            }
        }
    }catch(err){
        res.status(500).send({data:String(err)})
    }
});

router.post("/removementee",validate({ body: validJson.studentOnlySchema }),globalServices.authenticateJWT,async(req:Request, res:Response)=>{
    const mentorid=req.headers.mentorID;
    const studentid=req.body.studentID;
    try{
        const currStudent=await StudentModel.findOne({_id:studentid,"marks.mentorID": mentorid});
        if(currStudent)
        {
            if(currStudent.marks.lock===true)
            {
                res.status(400).send({message:"Cannot edit group once marks are submitted"});
            }else{
                await StudentModel.findOneAndUpdate({_id:studentid,"marks.mentorID": mentorid},{$set:{"marks.mentorID":"","marks.score":{"ideation":null,"execution":null,"viva":null,"picth":null}}});
                res.status(200).send({message:"Removed sucessfully"});    
            }
        }else{
            res.status(400).send({message:"Student not found as your mentee"});
        }
    }catch(err){
        res.status(500).send({data:String(err)})
    }
});

router.post("/savemarks",validate({ body: validJson.editMarksSchema }),globalServices.authenticateJWT,async(req:Request, res:Response)=>{
    const mentorid=req.headers.mentorID;
    const studentid=req.body.studentID;
    const newScore=req.body.score;
    try{
        const currStudent=await StudentModel.findOne({_id:studentid,"marks.mentorID": mentorid,"marks.lock":false});
        function checkMarksValidity(student) {
            const maxscore=student.marks.maxScore;
            const scoreKeys = Object.keys(newScore);
            const maxScoreKeys = Object.keys(maxscore);
            if (!scoreKeys.every((key) => maxScoreKeys.includes(key))) {
              return false;
            }
          
            for (const key of scoreKeys) {
              if (newScore[key] > maxscore[key]) {
                return false;
              }
            }
            return true;
          }
        if(currStudent)
        {
            if(!checkMarksValidity(currStudent))
            {
                res.status(200).send({message:"Improper marks format"});
            }else{
                await StudentModel.findOneAndUpdate({_id:studentid,"marks.mentorID": mentorid},{$set:{"marks.score":newScore}});
                res.status(200).send({message:"Saved sucessfully"});
            }

        }else{
            res.status(400).send({message:"Student not found, not your mentee, or marks already submitted"});
        }
    }catch(err){
        res.status(500).send({data:String(err)});
    }
});

router.post("/finalsubmit",globalServices.authenticateJWT,async(req:Request, res:Response)=>{
    const mentorid=req.headers.mentorID;
    try{
        const allStudents=await StudentModel.find({"marks.mentorID": mentorid});
        const arrLen=allStudents.length
        if(arrLen>=3 && arrLen<=4)
        {
            let isNull=false;
            let isSubmitted=false;
            let i=0;
            for(i=0; i<arrLen; i++)
            {
                const studentScore=allStudents[i]['marks']['score'];
                isNull = isNull || Object.values(studentScore).some(x=> x===null)
                isSubmitted = isSubmitted || allStudents[i]['marks']['lock']
                if(isNull)
                {
                    break;
                }
            }

            if(isNull)
            {
                res.status(400).send({message:`Mentee ${allStudents[i].name} has not been graded yet`});
            }else if(isSubmitted){
                res.status(400).send({message:`Marks already submitted!`});
            }else{
                await StudentModel.updateMany({"marks.mentorID":mentorid},{$set:{"marks.lock":true}});
                globalServices.sendMail(allStudents);
                res.status(200).send({message:"Marks Submitted"});
            }
        }else{
            res.status(400).send({message:"You must have 3-4 mentees"});
        }
    }catch(err){
        res.status(500).send({data:String(err)});
    }
});

module.exports = router;