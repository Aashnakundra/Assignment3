const{ reject } = require("assert");
const exp = require("express");
const fs = require("fs");
const { resolve } = require("path");

module.exports = {
    start: () => {
      return new Promise((res,rej) =>
       {
        let resoll = 1;
         fs.readFile(`./data/posts.json`, 'utf8', (err, data) => {
         if (err) {
         resoll = 0;
         rej(console.log("unable to read file!"));
      } else {
        if (resoll != 0) {
          posts = JSON.parse(data);
          res(console.log("Posts are read successfully!"));
        }
      }});
    
      fs.readFile(`./data/categories.json`, "utf8", (err, data) => {
        if (err) {
          resoll = 0;
          rej(console.log("unable to read file!"));
        } else {
          if (resoll != 0) {
            categories = JSON.parse(data);
            res(console.log("Categories are read successfully!"));
          }
        }
      });
   
    
    })
    },
    AllPosts: () => {
        return new Promise((res, rej) => {
            fs.readFile("./data/posts.json", "utf8", (err, data) => {
              if (JSON.parse(data).length <= 0) {
                rej("no results returned");
              } else {
                res(JSON.parse(data));
              }
            });
          });
    },
    PublishedPosts: () =>{
        return new Promise((res, rej) => {
            fs.readFile("./data/posts.json", "utf8", (err, data) => {
              let blogs = [];
              if (JSON.parse(data).length <= 0) {
                rej("no results returned");
              } else {
                JSON.parse(data).forEach((e) => {
                  if (e.published == true) {
                    blogs.push(e);
                  }
                });
                res(blogs);
              }
            });
          });
          
    },
    AllCategories: () => {
       return new Promise((res, rej) => {
        fs.readFile("./data/categories.json", "utf8", (err, data) => {
          if (data.length <= 0) {
            rej("no results returned");
          } else {
            res(JSON.parse(data));
          }
        });
      }); 
    },
    addPost: (postData) => {
      return new Promise((res, rej) => {
        if (postData.published == undefined) {
          postData.published= false;
        } else postData.published = true;
        let newvar = [];

        fs.readFile(",/data/posts.json","utf8", (err, data) => {
          if( JSON.parse(data).length) {
          throw new Error("no results returned");
        } else {
          newvar = JSON.parse(data);
        }
      });
      postData.id= posts.length + 1;
      postData.postDate =new Date().toISOString().slice(0, 10);
      console.log(newvar);
      newvar.push(Object.assign({}, postData));
      fs.writeFile("./data/posts.json", JSON.stringify(newvar),(err) => {
        if (err) {
          rej(err);
        }
      });
      res(console.log("Post Added Successfully!"));
    });
  },
    PostsMinDate: (minimumDt) => {
      return new Promise((resolve,reject) => {
        let fp =[];
        this.AllPosts.then((res) => {
          res.forEach((w) => {
            if (new Date(w.postDate) >= newDate(minimumDt)) {
              fp.push(w);
            }
          });
          return fp;
        })
        .then((fposts) => {
          if(fp.length) {
            resolve(fposts);
          }
        })
         .catch((err) =>reject(err));
        });
      },

      PostID: (id) => {
        return new Promise((resolve, reject) => {
          let  pst 
          this.AllPosts.then((posts)=>
          posts.forEach((l)=>
          {
            if(l.id==id)
            {
              pst=l;
            }
          })
          )
         .then((res)=>resolve(pst))
        .catch((err)=>reject("No result returned"));
          });
        },
      PostsBycategory: (catgry) => {
        return new Promise((resolve, reject) => {
          
          let outputs = [];
    this.AllPosts.then((res) => {
      res.forEach((w) => {
        if (w.category == catgry) {
          outputs.push(w);
        }
      });
      resolve(outputs);
     
        });
      });
      },
    };
      
               
    
  
  