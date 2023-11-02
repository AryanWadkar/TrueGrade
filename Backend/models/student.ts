import mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required: true
  },
  password: String,
  rollNo:String,
  marks:{
    required:true,
    type:{
      lock:Boolean,
      mentorID:String,
      score:{
        ideation:{
          type:Number,
          range:[0,10],
          default:null
        },
        execution:{
          type:Number,
          range:[0,10],
          default:null
        },
        viva:{
          type:Number,
          range:[0,10],
          default:null
        },
        pitch:{
          type:Number,
          range:[0,10],
          default:null
        },
      },
      maxScore:{
        ideation:{
          type:Number,
          default:10
        },
        execution:{
          type:Number,
          default:10
        },
        viva:{
          type:Number,
          default:10
        },
        pitch:{
          type:Number,
          default:10
        },
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
});

module.exports = mongoose.model("student", StudentSchema);