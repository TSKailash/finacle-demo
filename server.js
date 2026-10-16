import {getAllStudents,getStudentById,addStudent,updateStudent,deleteStudent} from "./router.js";
import express from "express";

const app=express();
app.use(express.json());
app.get("/api/students",getAllStudents);
app.get("/api/students/:id",getStudentById);
app.post("/api/students/addStudent",addStudent);
app.put("/api/students/updateStudent",updateStudent);
app.delete("/api/students/deleteStudent/:id",deleteStudent);
app.listen(3000,()=>{
    console.log("server is running on port 3000");
});