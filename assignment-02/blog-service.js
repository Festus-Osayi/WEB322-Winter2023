let posts = [];
let categories = [];
let fs = require('fs');
let path = require('path');




let readPosts = () =>{
    return new Promise(function(resolve, reject){
        fs.readFile(path.join(__dirname, 'data/posts.json'), 
        function(err, data){
            if(!err){
                // converts and read javascript strings into an objects.
                posts = JSON.parse(data);
                resolve();
            }
            else{
                reject('unable to read file');
            }
        })
    })
}

let readCategories = ()=>{
    fs.readFile(path.join(__dirname, 'data/categories.json'), 
    (err, data)=>{
        return new Promise(function(resolve, reject){
            if(!err){
                // converts and read javascript strings into an objects.
                categories = JSON.parse(data)
                resolve();
            }
            else{
                reject("Unable to read file")
            }
        })
    })
    
}

// get all post whose publised is eqauls to (true..)
module.exports.getPublishedPosts = function(){
    var post = posts.filter(function(el){
        return el.published === true;
    })

    return new Promise(function(resolve, reject){
        if(!post.length){
            reject('No Data!!')
        }
        else{
            console.log(post)
            resolve(post)
        }
    })
}

// This function will provide the full array of "posts" objects using the resolve method of the returned promise.

module.exports.getAllPosts = ()=>{
    return new Promise((resolve, reject)=>{
        if(posts.length == 0){
            reject("no results returned");
        }
        else{
            console.log("all posts returned")
            resolve(posts)
        }
    })
}

// This function will provide the full array of "category" objects using the resolve method of the returned promise.

module.exports.getCategories = ()=>{
    return new Promise((resolve, reject)=>{
        if(categories.length == 0){
            reject("no results returned");
        }
        else{
            console.log("all categories returned")
            resolve(categories)
        }
    })
}

module.exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        readPosts().then(readCategories).then(function () {
            console.log("read posts");
            console.log("read categories");
            resolve();
        })
            .catch(function (error) {
                console.log(error);
                reject(error);
            });
    })
}