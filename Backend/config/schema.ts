import { AllowedSchema } from "express-json-validator-middleware";

const studentOnlySchema: AllowedSchema  = {
    type: "object",
    required: ["studentID"],
    properties: {
      studentID:{
        type:"string",
        minLength:1
      }
    },
};

const editMarksSchema: AllowedSchema  = {
  type: "object",
  required: ["studentID","score"],
  properties: {
    studentID:{
      type:"string",
      minLength:1
    },
    score:{
      type:"object"
    }
  },
};

const mentorOnlySchema: AllowedSchema  = {
  type: "object",
  required: ["mentorID"],
  properties: {
      mentorID: {
      type: "string",
      minLength:12
    }
  },
};

module.exports={
    studentOnlySchema,
    editMarksSchema,
    mentorOnlySchema
}