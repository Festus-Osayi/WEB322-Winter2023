
const Sequelize = require("sequelize");
let exp = module.exports

let sequelize = new Sequelize(
    "oowbogjv",
    "oowbogjv",
    "3a9fGnJ8HkINuHiPcfS6lLHtBPDwuZEI",
    {
        host: "isilo.db.elephantsql.com",
        dialect: "postgres",
        port: 5432,
        dialectOptions: {
            ssl: { rejectUnauthorized: false },
        },
        query: { raw: true },
    }
);

// Creating Data Models
let Post = sequelize.define(
    "Post",
    {
        body: Sequelize.TEXT,
        title: Sequelize.STRING,
        postDate: Sequelize.DATE,
        featureImage: Sequelize.STRING,
        published: Sequelize.BOOLEAN,
    },
    {
        createdAt: true, // disable createdAt
        updatedAt: true, // disable updatedAt
    }
);

let Category = sequelize.define("Category", {
    category: Sequelize.STRING,
});

// defining the relationship between Post and category

Post.belongsTo(Category, { foreignKey: "category" });

// This function will invoke the sequelize.sync() function, which will ensure that we can connect to the DB and that our Post and Category models are represented in the database as tables.
exp.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize
            .sync()
            .then(() => {
                resolve("Database sync successfully");
            })
            .catch(() => {
                reject("unable to sync the database");
            });
    });
};

// This function will invoke the Post.findAll() function
exp.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        Post.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};

// This function will invoke the Post.findAll() function and filter the results by "category" (using the value passed to the function - ie: 1 or 2 or 3 … etc)
exp.getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({ where: { category: category } })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};

// This function will invoke the Post.findAll() function and filter the results to only include posts with the postDate value greater than or equal to the minDateStr(using the value passed to the function - ie: "2020-10-1" … etc)
exp.getPostsByMinDate = (minDateStr) => {
    const { gte } = Sequelize.Op;
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr),
                },
            }
                .then((data) => {
                    resolve(data);
                })
                .catch(() => {
                    reject("no results returned");
                }),
        });
    });
};

// This function will invoke the Post.findAll() function and filter the results by "id" (using the value passed to the function).
exp.getPostById = (id) => {
    return new Promise((resolve, reject) => {
        Post.findAll({ where: { id: id } })
            .then((data) => {
                resolve(data[0]);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};

// this functions replaces every blank value in post to null
exp.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        postData.published = postData.published ? true : false;

        // iterating through the post and setting every blank space to null
        for (let elem in postData) {
            if (postData[elem] === "") {
                postData[elem] = null;
            }
        }
        postData.postDate = new Date();

        Post.create(postData)
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject("unable to create post");
            });
    });
};

// This function will invoke the Post.findAll() function and filter the results by "published" (using the value true)
exp.getPublishedPosts = () => {
    return new Promise((resolve, reject) => {
        Post.findAll({ where: { published: true } })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};

// This function will invoke the Post.findAll() function and filter the results by "published" and "category"(using the value true for "published" and the value passed to the function - ie: 1 or 2 or 3 … etc for "category" )
exp.getPublishedPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({ where: { category: category, published: true } })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};

// This function will invoke the Category.findAll() function
exp.getCategories = () => {
    return new Promise((resolve, reject) => {
        Category.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};

// This ensures that any blank values in categoryData are set to null (
exp.addCategory = (categoryData) => {
    return new Promise((resolve, reject) => {
        (categoryData.category == "") ? categoryData.category = null : categoryData.Category = categoryData.Category;

        Category.create(categoryData)
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("unable to add a category");
            });
    });
};

// The purpose of this method is simply to "delete" categories using Category.destroy() for a specific category by "id".
exp.deleteCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        Category.destroy({ where: { id: id } })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject({ message: "Mission abort! unable to delete post, with the specified id" });
            });
    });
};

// The purpose of this method is simply to "delete" Posts using Post.destroy() for a specific category by "id"
exp.deletePostById = (id) => {
    return new Promise((resolve, reject) => {
        Post.destroy({ where: { id: id } })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject({message: "Mission abort! unable to delete post, with the specified id"});
            });
    });
};


