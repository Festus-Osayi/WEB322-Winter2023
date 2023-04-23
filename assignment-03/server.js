/**************** * WEB322 – Assignment 03 * 
I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part * of this assignment has been copied manually or electronically from any other source * 
(including 3rd party web sites) or distributed to other students. 
* * Name: __Festus Osayi____________________ Student ID: ___170276216___________ Date: ____2-17-2023____________ 
* * Cyclic Web App URL: _https://zany-gold-dove-tam.cyclic.app_____________________
* * GitHub Repository URL: _____________________https://github.com/Festus-Osayi/web322-app
* ********************************************************************************/


const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

let blogService = require('./blog-service')
let path = require('path')
let app = express();


// return the appropratie message..
const serverListener = (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Express http server listening on Port ${HTTP_PORT}`)
    }
}

// this serves static files..
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

blogService.initialize().then(() => {
    app.listen(HTTP_PORT, serverListener);
}).catch((error) => {
    console.error(error + " this is from server.js");
})

// setup a 'route' to listen on the default url path

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/home.html'))
})
// The route "/about" must return the about.html file from the views folder
app.get('/about', (req, res) => {

    res.sendFile(path.join(__dirname, 'views/about.html'));

});

// This route will return a JSON formatted string containing all of the posts within the posts.json file whose published property is set to true (i.e. "published" posts).
app.get('/blog', (req, res) => {
    // // res.header("Content-Type", 'application/json');
    // res.sendFile(path.join(__dirname, 'data/posts.json'));
    blogService.getPublishedPosts().then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json({ message: err });
    })
})

// This route will return a JSON formatted string containing all the posts within the posts.json files
app.get('/posts', (req, res) => {

    if (req.query.category) {
        blogService.getPostsByCategory(req.query.category).then(data => {
            res.status(200).json(data);
        }).catch(err => { res.status(200).json({ 'message': err }) })
    }
    else if (req.query.minDate) {
        blogService.getPostsByMinDate(req.query.minDate).then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json({ message: err })
        })
    }
    else {
        blogService.getAllPosts().then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(500).json({ message: err });
        })
    }

})

// This route will return a JSON formatted string containing all the categories within the categories.json file
app.get('/categories', (req, res) => {
    blogService.getCategories().then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json({ message: err });
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
    res.sendFile(path.join(__dirname, '/views/addPost.html'))
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
            category: parseInt(req.body.category),
            featureImage: req.body.featureImage,
            published: req.body.published
        };
        // 

        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        blogService.addPost(formData).then(() => {
            res.status(200).redirect('/posts')
        }).catch((err) => {
            res.status(500).json({ message: err })
        })


    }

})

app.get('/post/:value', (req, res) => {
    let id = req.params.value;
    blogService.getPostById(id).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).json({ message: err })
    })
})




















// return the appropraite error message when a use key in a wrong url..
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/error.html'))

});





