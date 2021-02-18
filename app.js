const express=require("express");
const bodyParser = require("body-parser");
const https=require("https");
const { response } = require("express");

var app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));             //public folder to hold static files: css,images

app.get("/",(req, res)=>{
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",(req,res)=>{
    const firstName = req.body.Fname;
    const lastName = req.body.Lname;
    const email = req.body.email;
    console.log(firstName,lastName,email)
    var data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_field:{
                    FNAME: firstName,
                    LNAME:lastName
                }
            }
        ]
    };
    var jsonData=JSON.stringify(data);
    const url="https://us1.api.mailchimp.com/3.0/lists/f6fade0153"
    var options={
        method:"POST",
        auth:"jun:dc7d48a3b4e2824c0eb9302b19fb6ff0-us1"
    };
    const request=https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname +"/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        //response.on("data",(data)=>{
        //    console.log(JSON.parse(data))
        //})

    });
    request.write(jsonData);
    request.end();

});
app.post("/failure", function(req, res) {
  res.redirect("/");
});

//for local host use port 3000
// app.listen(3000,()=>{
//     console.log("listen on http://localhost:3000")
// })
//for heroku, use dynamic port (process.env.PORT)
app.listen(process.env.PORT,()=>{
    console.log("app: newletter@1.0.0 listen on http://tranquil-caverns-27200")
})