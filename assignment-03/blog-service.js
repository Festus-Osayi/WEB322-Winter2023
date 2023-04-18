let posts = [];
let categories = [];
let fs = require('fs');
let path = require('path');
let exp = module.exports




let readPosts = () => {
    return new Promise(function (resolve, reject) {
        fs.readFile(path.join(__dirname, 'data/posts.json'),
            function (err, data) {
                if (!err) {
                    // converts and read javascript strings into an objects.
                    posts = JSON.parse(data);
                    resolve();
                }
                else {
                    reject('unable to read file');
                }
            })
    })
}

let readCategories = () => {
    fs.readFile(path.join(__dirname, 'data/categories.json'),
        (err, data) => {
            return new Promise(function (resolve, reject) {
                if (!err) {
                    // converts and read javascript strings into an objects.
                    categories = JSON.parse(data)
                    resolve();
                }
                else {
                    reject("Unable to read file")
                }
            })
        })

}

// get all post whose publised is eqauls to (true..)
exp.getPublishedPosts = function () {
    var post = posts.filter(function (el) {
        return el.published === true;
    })

    return new Promise(function (resolve, reject) {
        if (!post.length) {
            reject('No Data!!')
        }
        else {
            console.log(post)
            resolve(post)
        }
    })
}

// This function will provide the full array of "posts" objects using the resolve method of the returned promise.

exp.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        if (posts.length == 0) {
            reject("no results returned");
        }
        else {
            console.log("all posts returned")
            resolve(posts)
        }
    })
}

// This function will provide the full array of "category" objects using the resolve method of the returned promise.

exp.getCategories = () => {
    return new Promise((resolve, reject) => {
        if (categories.length == 0) {
            reject("no results returned");
        }
        else {
            console.log("all categories returned")
            resolve(categories)
        }
    })
}


exp.initialize = () => {
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

// a function that adds a new post...
exp.addPost = (postData) => {
    postData.published === undefined ? postData.published = false : postData.published = true

    postData.id = posts.length + 1;
    posts.push(postData);

    return new Promise((resolve, reject) => {
        if (postData.length === 0) {
            reject('No Data')
        } else {
            resolve(postData)
        }
    })

}

// return a JSON string consisting of all posts whose category property equals value
exp.getPostsByCategory = (category) => {

    return new Promise((resolve, reject) => {
        const categoriestPost = posts.filter(catEl => catEl.category == category)
        if (categoriestPost.length === 0) {
            reject('No data')
        } else {
            resolve(categoriestPost)
        }
    })
}

// return a JSON string consisting of all posts whose postDate property is equal or greater than value
exp.getPostsByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        const minDate = posts.filter(minEl => minEl.postDate >= minDateStr);
        if (minDate.length === 0) {
            reject('No data');
        } else {
            resolve(minDate);
        }
    })
}

// This route will return a JSON formatted string containing a single post whose id matches the value.
exp.getPostById = (id) => {
    return new Promise((resolve, reject) => {
        const returnId = posts.filter(value => value.id == id);
        if (returnId.length === 0) {
            reject('no result returned')
        } else {
            resolve(returnId)
        }
    })
}





