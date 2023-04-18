'use strict'
/********************************************************************************* * WEB322 – Assignment 04 * 
I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part * of this assignment has been copied manually or electronically from any other source *
(including 3rd party web sites) or distributed to other students. 
* * Name: __Festus Osayi____________________ Student ID: ___170276216___________ Date: ____2-17-2023____________
* * Cyclic Web App URL: _____https://sparkling-dove-cuff-links.cyclic.app ___________________________________________________
* * GitHub Repository URL: _____________________https://github.com/Festus-Osayi/web322-app_________________________________ 
* ********************************************************************************/
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');
const blogData = require('./blog-service')
const path = require('path')
const app = express();
const stripJs = require('strip-js');


//app use..
// Fixing the Navigation Bar to Show the correct "active" item
app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// this serves static files..
app.use(express.static(__dirname + '/public'))


// seting up the handlebars
//custom handlebars helper

app.engine('.hbs', exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        safeHTML: function (context) {
            return stripJs(context);
        }
    }
}));

app.set('view engine', '.hbs');






// setup a 'route' to listen on the default url path

app.get('/', (req, res) => {
    res.redirect('blog')
})
// The route "/about" must return the about.html file from the views folder
app.get('/about', (req, res) => {

    res.render('about');

});

// This route will return a JSON formatted string containing all of the posts within the posts.json file whose published property is set to true (i.e. "published" posts).
app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try {

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if (req.query.category) {
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        } else {
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0];

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    } catch (err) {
        viewData.message = "no results";
    }

    try {
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    } catch (err) {
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", { data: viewData })

});

// This is to ensure that individual blog posts can be rendered using the same layout as the main blog page. However, instead of displaying the latest blog post available / per category, we must instead show a specific blog post (by id).
app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try {

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if (req.query.category) {
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        } else {
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    } catch (err) {
        viewData.message = "no results";
    }

    try {
        // Obtain the post by "id"
        viewData.post = await blogData.getPostById(req.params.id);
    } catch (err) {
        viewData.message = "no results";
    }

    try {
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    } catch (err) {
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", { data: viewData })
});

// This route will return a JSON formatted string containing all the posts within the posts.json files
app.get('/posts', (req, res) => {

    if (req.query.category) {
        blogData.getPostsByCategory(req.query.category).then(data => {
            res.status(200).render('posts', {
                posts: data
            });
        }).catch(err => { res.render("posts", { message: "no results" }); })
    }
    else if (req.query.minDate) {
        blogData.getPostsByMinDate(req.query.minDate).then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json({ message: err })
        })
    }
    else {
        blogData.getAllPosts().then((data) => {
            res.status(200).render('posts', {
                posts: data
            });
        }).catch((err) => {
            res.render("posts", { message: "no results" });
        })
    }

})

// This route will return a JSON formatted string containing all the categories within the categories.json file
app.get('/categories', (req, res) => {
    blogData.getCategories().then((data) => {
        res.status(200).render('categories', {
            categories: data
        });
    }).catch((err) => {
        res.status(500).render('categories', { message: 'no results' });
    })
});


// ===============================================================
//               Updated sections for 3rd assignment
// ===============================================================

// This enables us to store every file upload in our dashboard
// instead of our local file storage.
cloudinary.config({
    cloud_name: 'dv75qktoz',
    api_key: '389826386351176',
    api_secret: 'OSTlNpj6NEXtDmZLpO1W7LuDi7c',
    secure: true
});

// no { storage: storage } since we are not using disk storage
const upload = multer();

// adding the required addpost route
app.get('/posts/add', (req, res) => {
    res.render('addPost')
})


// this correctly add the new blog post before redirecting the user to the /posts route
app.post('/posts/add', upload.single("featureImage"), (req, res) => {
    if (req.file) {
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
        upload(req).then((uploaded) => {
            processPost(uploaded.url);
        });
    } else {
        processPost("");
    }
    function processPost(imageUrl) {
        req.body.featureImage = imageUrl;
        const formData = {
            id: 0,
            body: req.body.body,
            title: req.body.title,
            postDate: new Date().toISOString().slice(0, 10),
            category: Number(req.body.category),
            featureImage: req.body.featureImage,
            published: req.body.published
        };
        // 

        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        blogData.addPost(formData).then(() => {
            res.status(200).redirect('/posts')
        }).catch((err) => {
            res.status(500).json({ message: err })
        })


    }

})

app.get('/post/:value', (req, res) => {
    let id = req.params.value;
    blogData.getPostById(id).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).json({ message: err })
    })
})

// initialize..
blogData.initialize().then(() => {
    app.listen(HTTP_PORT, serverListener);
}).catch((error) => {
    console.error(error + " this is from server.js");
})

// return the appropratie message..
const serverListener = (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Express http server listening on Port ${HTTP_PORT}`)
    }
}


// return the appropraite error message when a use key in a wrong url..
app.use((req, res) => {
    res.status(404).render('error')

});





