'use strict'
/********************************************************************************* * WEB322 – Assignment 02 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.No part * of this assignment has been copied manually or electronically from any other source * (including 3rd party web sites) or distributed to other students. * * Name: __Festus Osayi____________________ Student ID: ___170276216___________ Date: ____3 - 19 -2023____________ * * Cyclic Web App URL: _____https://sparkling-dove-cuff-links.cyclic.app ___________________________________________________ * * GitHub Repository URL: _____________________https://github.com/Festus-Osayi/web322-app_________________________________ * ********************************************************************************/
let posts = [];
let categories = [];
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
const exp = module.exports




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
    let post = posts.filter(function (el) {
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

    postData.postDate = new Date().toISOString().slice(0, 10);
    postData.id = posts.length + 1;
    posts.push(postData);

    // posts.push(postData);

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
            resolve(returnId[0])
        }
    })
}

//This function works exactly as getPublishedPosts() except that in addition to filtering by "post.published == true", it also include category in the filter, i.e. "post.published == true && post.category == category"

exp.getPublishedPostsByCategory = (category) => {
    let post = posts.filter(function (el) {
        return el.published == true && el.category == category;
    })
    return new Promise((resolve, reject) => {
        if (!post.length) {
            reject("No Data!")
        } else {
            console.log(post)
            resolve(post)
        }
    })
}





