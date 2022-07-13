const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
app.use(express.static(__dirname + "/public")); //public static files

app.set("view engine", "ejs"); //setting up ejs file
app.use(bodyParser.urlencoded({ extended: true })); //using body-parser

mongoose.connect("mongodb+srv://labanidas:labani06@cluster0.lhllk8y.mongodb.net/onlineExamDB"); //connecting mongodb

//student-answer-schema
const studentAnswerSchema = new mongoose.Schema({
  que:String,
  studentAnswer:String,
  correctAnswer:String
});
const StudentAnswer = mongoose.model("studentAnswer", studentAnswerSchema);

//student schema
const studentSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  email: String,
  phone: String,
  registrationNo: String,
  password: String,
  status: String,
  marksObtained: Number,
  result: [studentAnswerSchema]
});
const Student = mongoose.model("student", studentSchema);

//admin schema
const adminSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  email: String,
  phone: String,
  registrationNo: String,
  password: String,
});
const Admin = mongoose.model("admin", adminSchema);

//teacher schema
const teacherSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  email: String,
  phone: String,
  registrationNo: String,
  password: String,
});
const Teacher = mongoose.model("teacher", teacherSchema);

//questions schema
const questionSchema = new mongoose.Schema({
  que: String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  ans: String,
});
const Question = mongoose.model("question", questionSchema);




//home page
app.get("/", (req, res) => {
  res.render("home");
});

// url params
app.get("/:param", (req, res) => {
  const params = _.toLower(req.params.param);
  if (params === "register") res.render("registration-page");
  else if (params === "login")
    res.render("login", { title: "Login to your account." });
  else res.sendFile(__dirname + "/public/fail.html");
  // console.log(req.params.param);
});

//home page post
app.post("/", (req, res) => {
  const { button } = req.body;
  if (button == "login")
    res.render("login", { title: "Login to your account." });
  else res.render("registration-page");
});

//register post
app.post("/register", (req, res) => {
  if (req.body.button == "back") res.redirect("/");
  else {
    const input = req.body.input[0];
    var { fname, lname, dob, email, phoneno, regno, password } = req.body;
    fname = _.capitalize(fname);
    lname = _.capitalize(lname);
    if (input === "admin") {
      const admin = new Admin({
        name: fname + " " + lname,
        dob: dob,
        email: email,
        phone: phoneno,
        registrationNo: regno,
        password: password,
      });
      admin.save();
      console.log("Saved succesfully to " + input);
    } else if (input === "teacher") {
      const teacher = new Teacher({
        name: fname + " " + lname,
        dob: dob,
        email: email,
        phone: phoneno,
        registrationNo: regno,
        password: password,
      });
      teacher.save();
      console.log("Saved succesfully to " + input);
    } else {
      const student = new Student({
        name: fname + " " + lname,
        dob: dob,
        email: email,
        phone: phoneno,
        registrationNo: regno,
        password: password,
        status:'Not appeared'
      });
      student.save();
      console.log("Saved succesfully to " + input);
    }
  }
  res.render("login", {
    title: "Successfully registered! Please login to continue.",
  });
});

//login page post
app.post("/login", (req, res) => {
  if (req.body.button == "back") res.redirect("/");
  else {
    const input = req.body.input[0];
    const { regno, password } = req.body;

    if (input === "admin") {
      Admin.findOne(
        { registrationNo: regno, password: password },
        (err, result) => {
          if (!result)
            res.render("login", {
              title:
                "invalid registration number or password! Please try again.",
            });
          else {
            Student.find({}, (err, elements) => {
              res.render("admin", {
                title: "Admin",
                name: result.name,
                regno: result.registrationNo,
                users: elements,
                button: "student",
              });
            });
          }
        }
      );
    } else if (input === "teacher") {
      Teacher.findOne(
        { registrationNo: regno, password: password },
        (err, result) => {
          if (!result)
            res.render("login", {
              title:
                "invalid registration number or password! Please try again.",
            });
          else {
            Student.find({}, (err, elements) => {
              res.render("admin", {
                title: "Teacher",
                name: result.name,
                regno: result.registrationNo,
                users: elements,
                button: "student",
              });
            });
          }
        }
      );
    } else {
      Student.findOne(
        { registrationNo: regno, password: password },
        (err, result) => {
          if (!result)
            res.render("login", {
              title:
                "invalid registration number or password! Please try again.",
            });
          else {
            if (result.status === "Appeared") {
                res.render("result", {
                  title: "Result",
                  name: result.name,
                  regno: result.registrationNo,
                  marks: result.marksObtained,
                  fullMarks: result.result.length,
                });
              
              // res.render("result", {
              //   title: "Result",
              //   name: result.name,
              //   regno: result.registrationNo,
              //   marks: result.marksObtained,
              //   fullMarks: result.result.length,
              //   answers: result.result
              // });
            } else {
              res.render("start-exam-button",{
                title: "BEST WISHES",
                name:result.name,
                regno:result.registrationNo,
              })
            }
          }
        }
      );
    }
  }
});

//admin - teacher interface nagigation-bar also logout- method
app.post("/navigate", (req, res) => {
  const { button, title, name, regno } = req.body;
  switch (button) {
    case "admin":
      Admin.find({}, (err, elements) => {
        res.render("admin", {
          title: title,
          name: name,
          regno: regno,
          users: elements,
          button: button,
        });
      });
      break;
    case "teacher":
      Teacher.find({}, (err, elements) => {
        res.render("admin", {
          title: title,
          name: name,
          regno: regno,
          users: elements,
          button: button,
        });
      });
      break;
    case "student":
      Student.find({}, (err, elements) => {
        res.render("admin", {
          title: title,
          name: name,
          regno: regno,
          users: elements,
          button: button,
        });
      });
      break;
    case "questions":
      Question.find({}, (err, elements) => {
        res.render("questions", {
          title: title,
          name: name,
          regno: regno,
          questions: elements,
        });
      });
      break;
    case "score-card":
      Student.findOne({name:name, registrationNo:regno},(err,result)=>{
        if(err) console.log(err);
        else{
            res.render("result", {
              title: "Result",
              name: result.name,
              regno: result.registrationNo,
              marks: result.marksObtained,
              fullMarks: result.result.length,
            });
        }
      });
      break;
      case 'view-ans':
        Student.findOne({name:name, registrationNo:regno},(err,result)=>{
          res.render("view-ans", {
            title: "Result",
            name: result.name,
            regno: result.registrationNo,
            marks: result.marksObtained,
            fullMarks: result.result.length,
            answers: result.result
          });
        });
        break;

    case "logout":
      res.redirect("/login");
  }

  // console.log(req.body);
});

//new-question-form only  for admins
app.post("/new-question", (req, res) => {
  // console.log(req.body);
  const { name, regno, newQuestion, op1, op2, op3, op4, ans } = req.body;
  const new_que = new Question({
    que: newQuestion,
    option1: op1,
    option2: op2,
    option3: op3,
    option4: op4,
    ans: ans,
  });
  new_que.save( (err)=>{
    if(!err){
      Question.find({}, (err, elements) => {
        res.render("questions", {
          title: "Admin",
          name: name,
          regno: regno,
          questions: elements,
        });
      });
    } else console.log(err);
  });

  
});

//delete-student-post-request
app.post("/delete-student", (req, res) => {
  const { title, name, regno, button } = req.body;
  Student.findByIdAndDelete(button, (err) => {
    if (err) console.log(err);
    else {
      Student.find({}, (err, elements) => {
        res.render("admin", {
          title: title,
          name: name,
          regno: regno,
          users: elements,
          button: "student",
        });
      });
    }
  });
});


//start-exam form
app.post("/start-exam", (req,res)=>{
  const{name,regno}=req.body;

  Question.find({}, (err, elements) => {
    res.render("questions", {
      title: "Student",
      name: name,
      regno: regno,
      questions: elements,
    });
  });
})

//submit answers form post method
app.post("/submit-ans", (req, res) => {
  // console.log(req.body);
  const { title, name, regno } = req.body;

  Question.find({}, (err, elements) => {
    var marks = 0;
    elements.forEach((item) => {
      //saving students answers
      const studentAnswer = new StudentAnswer({
        que: item.que,
        studentAnswer:req.body[item.que],
        correctAnswer: item.ans
  
      });
      Student.findOne({name: name, registrationNo: regno}, (err, result)=>{
        if(err) console.log(err);
        else{
          result.result.push(studentAnswer);
          result.save();
          // res.redirect("/"+list);
          console.log("saved answers");
        }
        
      })
      if (req.body[item.que] === item.ans) {
        marks++;
        // console.log(req.body[item.que]," ",item.ans);
      }
    });
    
    Student.updateOne(
      { name: name, registrationNo: regno },
      { status: "Appeared", marksObtained: marks},
      (err) => {
        if (err) console.log(err);
        else {
          console.log("updated");
        }
      }
    );
    res.render("login", { title: "Login to see your score!" });
    console.log("marks="," ",marks);
  });
});

//delete-question post method
app.post("/delete-question", (req, res) => {
  const { button, name, regno } = req.body;
  Question.findByIdAndRemove(button, (err) => {
    if (err) console.log(err);
    else {
      Question.find({}, (err, elements) => {
        res.render("questions", {
          title: "Admin",
          name: name,
          regno: regno,
          questions: elements,
        });
      });
    }
  });
});

//result post method  - view answers
// app.post("/result",(req,res)=>{
//   const{regno,name} = req.body;

//   Student.findOne({name:name, registrationNo:regno},(err,result)=>{
//     res.render("view-ans", {
//       title: "Result",
//       name: result.name,
//       regno: result.registrationNo,
//       marks: result.marksObtained,
//       fullMarks: result.result.length,
//       answers: result.result
//     });
//   })
  

//   // Question.find({},(err,elements)=>{
//   //   res.render("view-ans",{
//   //     title: "Result",
//   //     name:name,
//   //     regno:regno,
//   //     answers:elements
  
//   //   })
//   // })
  
// });

//error-page-go-back
app.post("/error-page-back", (req, res) => {
  res.render("login", { title: "Please login to continue." });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
