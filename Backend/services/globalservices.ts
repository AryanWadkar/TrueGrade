import { Response,Request } from 'express';
const jwt = require("jsonwebtoken");
require('dotenv').config();
import * as nodemailer from 'nodemailer';

const authenticateJWT = (req:Request, res:Response, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        try{
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.JWTENC, (err, mentor) => {
                if (err) {
                    return res.status(403).send({message:"Invalid token"});
                }else{
                    req.headers.mentorID = mentor.mentorID;
                    next();
                }
            });
        }catch(err){
            res.status(401).send({message:"Error verifying token"})
        }

    } else {
        res.status(401).send({message:"Token not found"});
    }
};

const sendMail = (studentList) => {
    function generateEmailText(student) {
        const { name, email, marks } = student;
        const { score, maxscore } = marks;
      
        const scoreText = Object.entries(score)
          .map(([category, value]) => {
            const maxScore = maxscore[category];
            return `- ${category}: ${value}/${maxScore}`;
          })
          .join('\n');
      
        const emailText = `Dear ${name},
      
      We are pleased to inform you that your marks have been submitted. Here are your final marks:
      
      ${scoreText}
      
      Thank you for your hard work. If you have any questions or concerns, please feel free to contact us at ${email}.
      
      Best regards,
      The TrueGrade Team`;
      
        return emailText;
      }

      try{
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.SMTP_MAIL,
              pass:process.env.SMTP_APP_PASS
            }
       });
       studentList.forEach(element => {
            const mailBody=generateEmailText(element);
            let mailOptions={
                from: process.env.SMTP_MAIL,
                to: element.email,
                subject: 'Evaluation Result',
                text: mailBody
              };
                
            transporter.sendMail(mailOptions, function(err, data) {});
       });

    }catch(err)
    {
        console.log("error sending ticket mail:"+err);
    }

};

module.exports={
    authenticateJWT,
    sendMail
}