/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Aashna Kundra Student ID: 163028210 Date: 24/2/2023
*
*  Cyclic Web App URL: https://dark-erin-sneakers.cyclic.app
*
*  GitHub Repository URL: https://github.com/Aashnakundra/Assignment3.git
*
********************************************************************************/ 
var express = require("express");
var app = express();
var path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2
const streamifier =require("streamifier");

const upload =multer();

cloudinary.config({
    cloud_name:'drohqed63',
    api_key:'451292663342194',
    api_secret:'WkVqQeVbwt8Kg0adcEhxo3rJvJ4',
    secure:true
});
var HTTP_PORT = process.env.PORT || 8080;

var filemy = require("./blog-service");  


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", home);
function home(req, res) {
  res.redirect("/about");
}


app.get("/about",About); 
function About(req,res) {
    res.sendFile(path.join(__dirname,"/views/about.html"));
};
      
 app.get("/blog", Blogs);
 function Blogs(req,res){
     filemy.PublishedPosts().then((pst) => res.send(pst))
     .catch((err) => {
       console.log(err);
     });
 }

 app.get("/posts",Posts);
 function Posts(req,res) {
     let givCat = req.query.category;
     let givDt = req.query.minDate;
     if (givCat) {
         filemy.PostsByCategory.then((res) =>res.send(res)).catch((error) =>
         console.error(error)
         );
     } else if(givDt) {
         PostsMinDate(givDt)
         .then((res) => res.send(res))
         .catch((error) => console.error(error));
     } else {
         filemy
         .AllPosts()
         .then((postt) => res.send(postt))
         .catch((err) => {
             console.log(err);
        });
     }
 }
        
 app.get("/categories",Categories)
 function Categories(req,res)
 {
     filemy.AllCategories().then ((categories) => res.send(categories))
     .catch((err) => {
         console.log(err);
     });
 }


 app.post("/posts/add", upload.single("photo"), (req, res) => {
     if(req.file) {
         let streamUpload = (req) => {
             return new Promise((resolve, reject) => {
                 let stream = cloudinary.uploader.upload_stream(
                     (error, result) => {
                         if (result) {
                             resolve(result);
                         } else {
                             reject(error);
                         }
                     }
                );
    
                streamifier.createReadStream(req.file.buffer).pipe(stream);
             });
         };
         async function upload(req) {
             let result = await streamUpload(req);
             console.log(result);
             return result;
         }
    
         upload(req).then((uploaded)=>{
             processPost(uploaded.url);
         });
     }else{
         processPost("");
     }
     function processPost(imageUrl){
         req.body.photo = imageUrl;

         filemy.addPost(req.body).then(() => res.redirect("/posts"));
     }
 });
 app.get("/posts/add",(req,res) => {
     res.sendFile(path.join(___dirname, "/views/addPost.html"));
 });
 app.get("/posts/:id",(req,res) => {
     let givId = req.params.id;
     filemy
     .PostID(givId)
     .then((res) => res.send(res))
     .catch((error) => console.error(error));
 });
    
filemy.start().then((res) =>
{
    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on ${HTTP_PORT}`);
    });
 });
  