/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'test';
const collection = 'Customers';

// The current database to use.
use(database);

// Create a new collection.
db.createCollection(collection);

// inserting a documents into the customers collection..

db.Customers.insertMany([

    {
        "_id": 319,
        customerName: "Mini Classics",
        contactInfo: {
            contactLastName: "Frick",
            contactFirstName: "Steve",
            phone: "9145554562",
            address: "3758 North Pendale Street"

        },
        city: "White Plains",
        state: "NY",
        postalCode: "24067",
        country: "USA",
        salesRepEmployeeNumber: 1323,
        creditLimit: 102700,
        customerOrders: ["2004 Acura TLX", "Alfa Romeo Giulia", "Alfa Romeo Stelvio"],
        OrderNumber: 10210,
        orderDate: new ISODate("2004-01-12T10:03:46.000Z"),
        totalOrdes: 100,
        avgOrder: 56

    },

    {
        "_id": 320,
        customerName: "Mini Creations Ltd",
        contactInfo: {
            contactLastName: "Huang",
            contactFirstName: "Wing",
            phone: "5085559555",
            address: "4575 Hillside Dr"

        },
        city: "New Bedford",
        state: "MA",
        postalCode: "50553",
        country: "USA",
        salesRepEmployeeNumber: 1188,
        creditLimit: 94500,
        customerOrders: ["2023 Audi A3", "2023 Audi A4", "2023 Audi A5"],
        OrderNumber: 10211,
        orderDate: new ISODate("2023-02-31T06:31:15Z"),
        totalOrdes: 50,
        avgOrder: 28

    },

    {
        "_id": 321,
        customerName: "Corporate Gift Ideas Co",
        contactInfo: {
            contactLastName: "Brown",
            contactFirstName: "Julie",
            phone: "+649 312 5555",
            address: "162-164 Grafton Road"

        },
        city: "Auckland",
        state: null,
        postalCode: null,
        country: "New Zealand",
        salesRepEmployeeNumber: 1165,
        creditLimit: 67500,
        customerOrders: ["2023 Audi Allroad", "2023 Audi e-tron", "2023 Audi A5"],
        OrderNumber: 10220,
        orderDate: new ISODate("2023-01-31T14:10:30Z"),
        totalOrdes: 21,
        avgOrder: 13

    },

    {
        "_id": 322,
        customerName: "Australian Gift Network, Co",
        contactInfo: {
            contactLastName: "Calaghan",
            contactFirstName: "Ben",
            phone: "61-7-3844-6555",
            address: "31 Duncan St. West End"

        },
        city: "South Brisbane",
        state: "Queensland",
        postalCode: "4101",
        country: "Australia",
        salesRepEmployeeNumber: 1611,
        creditLimit: 51600,
        customerOrders: ["Bentley Bentayga", "Bentley Flying Spur", "2023 BMW 2 Series"],
        OrderNumber: 10264,
        orderDate: new ISODate("2023-02-15T00:00:00Z"),
        totalOrdes: 15,
        avgOrder: 9

    }


])

// checking if the documents were inserted properly..
db.Customers.find()

// 1.Insure your collection has documents that allows grouping by a key value pair. Have two groups with three documents and one group with four documents at minimum. Show the number of documents in each group and include one other key value pair that you do something with. The classroom example was average duration in minutes for books in the group. 

// match any country name, that isn't New Zealand and group by their customerName and Country.
db.Customers.aggregate([{ "$match": { country: { $ne: "New Zealand" } } },
{ $group: { "_id": { customerName: "$customerName", country: "$country" } } }

])

// grouping by the customerName and orderNumber
db.Customers.aggregate({
    $group: {
        _id: {
            customerName: "$customerName"
        }
    }
})

// Showing the number of documents in each group and include one other key value pair that you do something with.

db.Customers.aggregate([
    {
        "$group": {
            "_id": "$customerName",
            "ordernum": { "$min": "$OrderNumber" },
            "creditLimitSum": { "$sum": "$creditLimit" }
        }

    }, { "$limit": 1 }])

// 2. You should already have a date key value pair in your documents in your collection. Do a date calculation for all your documents. The classroom example was years since published for audiobooks.

db.Customers.aggregate({
    $project: {

        "monthNumdifference": {
            $add: [{ $month: "$orderDate" }, { $month: new Date() }]
        }

    }
})

// 3. Demonstrate a conditional remove based on a value in a key value pair. The classroom example showed only showing a middle name for an author if there was a middle name and not a space. You can do something similar, or something that fits with your collection construction that allow some key value pairs to show and some to be suppressed. 

// showing the documents before removing it...
db.Customers.find().pretty()

//  Demonstrating a conditional remove based on a value in a key value pair. 
db.Customers.aggregate([
    {
        $project: {
            customerName: 1,
            "contactInfo.contactFirstName": 1,
            "contactInfo.contactLastName": 1,
            "contactInfo.phone": 1,
            state: {
                $cond: {
                    if: { $eq: [null, "$state"] },
                    then: "$$REMOVE",
                    else: "$state"
                }
            }
        }
    }
])

//4. Demonstrate a sort of the documents in your collection. Be prepared to go in ascending or descending order.

db.Customers.find().sort({ "contactInfo.contactLastName": 1 })

// 5. Demonstrate adding an array element to a key value pair with $push. Show your array before, add the element and show your array after.

// before $pushing to the array..
db.Customers.find().pretty()

// pushing a new value to the array..
db.Customers.updateOne({ "_id": 320 },
    {
        $push: {
            customerOrders: "BMW X7"
        }
    })

// checking the customerOrders array, if the  value was pushed in correctly..
db.Customers.find({ customerOrders: { $in: ["BMW X7"] } }).pretty()

// 6. Look in the mongoDB manual and show something you have not seen in class but find interesting.

// probably not much of a complex task but I find it interesting
// because it can easily help a user to filter out the value so
// easily. Which is regexp and although this can be achieved in different
// ways
db.Customers.find({ customerName: { $regex: /Mini/i } })

