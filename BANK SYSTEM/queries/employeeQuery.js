const mysql = require("mysql2");
const dotenv = require("dotenv");
const auth = require("../routes/employeeAuth");

dotenv.config();

const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DATABASE
});

con.connect((err)=>{
    if(err) console.log(err);
})

// Try implementing password hashing
const checkPWD = (stored,userInput)=>{
    if (stored==userInput)
        return true
    else
        return false
};


exports.checkUser = (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    con.query(`SELECT * FROM user_details WHERE User_Name=?`,[username],(err,result)=>{
        if (result[0]){
            if (checkPWD(result[0].Password,password)){
                const token = auth.getToken(username); // This is where we create the access token at login
                res.cookie("jwt",token,{
                    //maxAge: 600000,
                    httpOnly: true
                })

                // Check whether its a manager or an employee
                con.query(`call get_Position(?)`,[username],(err,result)=>{
                    const position = result[0][0].Position;
                    console.log(position);
                    if (position=="Manager"){res.redirect("employee-dashboard/manager");}
                    else {res.redirect("employee-dashboard");}
                    
                })

            } else{
                res.render("employee-login",{message: "Invalid Username or Password"});
            }
        } else{
            res.render("employee-login",{message: "Invalid Username or Password"});
        }
    });
}

exports.addUser = (req,res)=>{
    
}

