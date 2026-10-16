import mysql from "mysql2";

var connection = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "root",
    database: "studentdb"});
connection.connect();
export const getAllStudents = (req,res)=>{
    connection.query("select * from student", function(err, result){
        if(err){
            console.log(err);
            res.status(500).send("Error retrieving students");
        }else{
            res.json(result);
        }
    });
}


export const getStudentById = (req,res)=>{
    const id=req.params.id;
    let sql="select * from student where id=?";
    connection.query(sql,[id],function(err,result){
        if(err){
            console.log(err);
            res.status(500).send("Error retrieving student");
        }else{
            if(result.length>0){
                res.json(result[0]);
            }else{
                res.status(404).send("Student not found");
            }
        }
    });
}

export const addStudent=(req,res)=>{
    const newstu=req.body;
    let sql="insert into student(name,age) values(?,?)";
    connection.beginTransaction((err)=>{
        if(err){
            res.json({message:"Error starting transaction"});
            return;
        }
        connection.query(sql,[newstu.name,newstu.age],(err,result)=>{
            if(err){
                connection.rollback(()=>{
                    res.json({message:"Error adding student"});
                });
                return;
            }
            connection.commit((err)=>{
                if(err){
                    connection.rollback(()=>{
                        res.json({message:"Error committing transaction"});
                    });
                    return;
                }else{
                    res.json({message:"Student added successfully and your ID is "+result.insertId,newstu});
                }
            });
        });
    });
}
export const updateStudent=(req,res)=>{
    const newStu=req.body;
    const id=newStu.id;
    let sql="update student set name=?,age=? where id=?";
    connection.beginTransaction((err)=>{
        if(err){
            res.json({message:"Error starting transaction"});
            return;
        }
        connection.query(sql,[newStu.name,newStu.age,id],(err,result)=>{
            if(err){
                connection.rollback(()=>{
                    res.json({message:"Error updating student"});
                });
                return;
            }else if(result.affectedRows===0){
                connection.rollback(()=>{
                    res.json({message:"Student not found"});
                });
                return;
            }
            connection.commit((err)=>{
                if(err){
                    connection.rollback(()=>{
                        res.json({message:"Error committing transaction"});
                    });
                    return;
                }else{
                    res.json({message:"Student updated successfully",newStu});
                }
            });
        });
    })

}
export const deleteStudent=(req,res)=>{
    const id  =req.params.id;
    let sql="delete from student where id=?";
    connection.beginTransaction((err)=>{
        if(err){
            res.json({message:"Error starting transaction"});
            return;
        }
        connection.query(sql,[id],(err,result)=>{
            if(err){
                connection.rollback(()=>{
                    res.json({message:"Error deleting student"});
                });
                return;
            }else if(result.affectedRows===0){
                connection.rollback(()=>{
                    res.json({message:"Student not found"});
                });
                return;
            }else{
                connection.commit((err)=>{
                    if(err){
                        connection.rollback(()=>{
                            res.json({message:"Error committing transaction"});
                        });
                        return;
                    }else{
                        res.json({message:"Student deleted successfully",id});
                    }
                });
            }
        })
    })
}