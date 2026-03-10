import React, { useEffect, useState } from 'react';
import 'prismjs/themes/prism.css';
import '../styles/debouncing.css';
import CodeBlock from './CodeBlock';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function IMPQueries() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [activeTab, setActiveTab] = useState('NORMAL');

    const allQueries = [
        { num: 1, topic: 'SELECT', requirement: 'Retrieve all users aged 30.', mysql: 'SELECT * FROM Users WHERE age = 30;', mongo: 'db.users.find({ age: 30 })', type: 'NORMAL' },
        { num: 2, topic: 'INSERT', requirement: 'Add a new user named "Anjali" in "Pune" (age 29, dept "HR").', mysql: 'INSERT INTO Users (user_id, name, city, age, department) VALUES (9, \'Anjali\', \'Pune\', 29, \'HR\');', mongo: 'db.users.insertOne({ _id: 9, name: \'Anjali\', city: \'Pune\', age: 29, department: \'HR\' })', type: 'NORMAL' },
        { num: 3, topic: 'UPDATE', requirement: 'Change the department of "Sunil Joshi" (user_id 5) to "Tech".', mysql: 'UPDATE Users SET department = \'Tech\' WHERE user_id = 5;', mongo: 'db.users.updateOne({ _id: 5 }, { $set: { department: \'Tech\' } })', type: 'NORMAL' },
        { num: 4, topic: 'DELETE', requirement: 'Delete the newly added user "Anjali" (user_id 9).', mysql: 'DELETE FROM Users WHERE user_id = 9;', mongo: 'db.users.deleteOne({ _id: 9 })', type: 'NORMAL' },
        { num: 5, topic: 'PROJECTION', requirement: 'Find all product names and prices, but exclude their IDs.', mysql: 'SELECT name, price FROM Products;', mongo: 'db.products.find({}, { name: 1, price: 1, _id: 0 })', type: 'NORMAL' },
        { num: 6, topic: 'OR/IN', requirement: 'Find users from either "Mumbai" or "Chennai".', mysql: 'SELECT name, city FROM Users WHERE city IN (\'Mumbai\', \'Chennai\');', mongo: 'db.users.find({ city: { $in: [\'Mumbai\', \'Chennai\'] } }, { name: 1, city: 1, _id: 0 })', type: 'NORMAL' },
        { num: 7, topic: 'AND', requirement: 'Find users aged 30 working in "Sales".', mysql: 'SELECT name FROM Users WHERE age = 30 AND department = \'Sales\';', mongo: 'db.users.find({ age: 30, department: \'Sales\' }, { name: 1, _id: 0 })', type: 'NORMAL' },
        { num: 8, topic: 'RANGE', requirement: 'Find products priced between 1000 and 3000 (inclusive).', mysql: 'SELECT name, price FROM Products WHERE price BETWEEN 1000 AND 3000;', mongo: 'db.products.find({ price: { $gte: 1000, $lte: 3000 } }, { name: 1, price: 1, _id: 0 })', type: 'NORMAL' },
        { num: 9, topic: 'LIKE / REGEX', requirement: 'Find product names containing the word "Loose".', mysql: 'SELECT name FROM Products WHERE name LIKE \'%Loose%\';', mongo: 'db.products.find({ name: { $regex: \'Loose\', $options: \'i\' } }, { name: 1, _id: 0 })', type: 'NORMAL' },
        { num: 10, topic: 'NOT', requirement: 'Find all users NOT in the "IT" department.', mysql: 'SELECT name FROM Users WHERE department != \'IT\';', mongo: 'db.users.find({ department: { $ne: \'IT\' } }, { name: 1, _id: 0 })', type: 'NORMAL' },
        { num: 25, topic: 'Unique Values', requirement: 'Get a list of all unique departments.', mysql: 'SELECT DISTINCT department FROM Users;', mongo: 'db.users.distinct(\'department\')', type: 'NORMAL' },
        { num: 26, topic: 'SORT/ORDER', requirement: 'List all products sorted by price (low to high).', mysql: 'SELECT name, price FROM Products ORDER BY price ASC;', mongo: 'db.products.find({}, { name: 1, price: 1, _id: 0 }).sort({ price: 1 })', type: 'NORMAL' },
        { num: 27, topic: 'TOP N', requirement: 'Find the top 3 most expensive products.', mysql: 'SELECT name, price FROM Products ORDER BY price DESC LIMIT 3;', mongo: 'db.products.find({}, { name: 1, price: 1, _id: 0 }).sort({ price: -1 }).limit(3)', type: 'NORMAL' },
        { num: 28, topic: 'LIMIT/OFFSET (Q.2)', requirement: 'Pagination: Skip the first 4 users and retrieve the next 2.', mysql: 'SELECT name FROM Users LIMIT 2 OFFSET 4;', mongo: 'db.users.find({}, { name: 1, _id: 0 }).skip(4).limit(2)', type: 'NORMAL' },
        { num: 29, topic: 'SORT/RANGE', requirement: 'List products ordered by name (A-Z) only if the price is above 1500.', mysql: 'SELECT name, price FROM Products WHERE price > 1500 ORDER BY name ASC;', mongo: 'db.products.find({ price: { $gt: 1500 } }, { name: 1, price: 1, _id: 0 }).sort({ name: 1 })', type: 'NORMAL' },
        { num: 30, topic: 'SORT (Compound)', requirement: 'List users, prioritizing "Sales" department first, then sorting by age (descending).', mysql: 'SELECT name, department, age FROM Users ORDER BY CASE WHEN department = \'Sales\' THEN 0 ELSE 1 END, age DESC;', mongo: `db.users.find().sort({ department: 1, age: -1 }).project({ name: 1, department: 1, age: 1, _id: 0 })`, type: 'NORMAL' },
        { num: 31, topic: 'Subquery', requirement: 'Find the names of users who ordered Product ID 101.', mysql: 'SELECT name FROM Users WHERE user_id IN (SELECT user_id FROM Orders WHERE product_id = 101);', mongo: `db.users.find({ _id: { $in: db.orders.distinct('user_id', { product_id: 101 }) } }, { name: 1, _id: 0 })`, type: 'NORMAL' },
        { num: 33, topic: 'Date Comparison', requirement: 'Find orders placed after May 15, 2024.', mysql: 'SELECT order_id, order_date FROM Orders WHERE order_date > \'2024-05-15\';', mongo: `db.orders.find({ order_date: { $gt: new Date('2024-05-15') } }, { _id: 1, order_date: 1 })`, type: 'NORMAL' },
        { num: 34, topic: 'Array Filter', requirement: 'Find all products tagged with both "tech" AND "mouse".', mysql: 'SELECT name FROM Products WHERE JSON_CONTAINS(tags, \'["tech", "mouse"]\');', mongo: `db.products.find({ tags: { $all: ['tech', 'mouse'] } }, { name: 1, _id: 0 })`, type: 'NORMAL' },
        { num: 35, topic: 'Array Update', requirement: 'For product 101, add the tag "new-arrival".', mysql: 'UPDATE Products SET tags = JSON_ARRAY_APPEND(tags, \'$\', \'new-arrival\') WHERE product_id = 101;', mongo: `db.products.updateOne({ _id: 101 }, { $push: { tags: 'new-arrival' } })`, type: 'NORMAL' },
        { num: 36, topic: 'Array Size', requirement: 'Find products that have exactly 3 tags.', mysql: 'SELECT name FROM Products WHERE JSON_LENGTH(tags) = 3;', mongo: `db.products.find({ tags: { $size: 3 } }, { name: 1, _id: 0 })`, type: 'NORMAL' },
        { num: 39, topic: 'Array Element Match', requirement: 'Find products where the first tag in the array is "tshirt".', mysql: 'SELECT name FROM Products WHERE JSON_EXTRACT(tags, \'$[0]\') = \'tshirt\';', mongo: `db.products.find({ 'tags.0': 'tshirt' }, { name: 1, _id: 0 })`, type: 'NORMAL' },
        { num: 40, topic: 'Update Multiple', requirement: 'For all products in the "Electronics" category, increase the price by 10%.', mysql: 'UPDATE Products SET price = price * 1.10 WHERE category = \'Electronics\';', mongo: `db.products.updateMany({ category: 'Electronics' }, { $mul: { price: 1.10 } })`, type: 'NORMAL' },
        { num: 41, topic: 'Indexing', requirement: 'Create a unique index on the "name" field in the Users collection.', mysql: 'CREATE UNIQUE INDEX idx_name ON Users (name);', mongo: `db.users.createIndex({ name: 1 }, { unique: true })`, type: 'NORMAL' },
        { num: 42, topic: 'Explain Plan', requirement: 'Show the execution plan for a simple query to check index usage.', mysql: 'EXPLAIN SELECT name, city FROM Users WHERE name = \'Aarav Sharma\';', mongo: `db.users.find({ name: 'Aarav Sharma' }, { name: 1, city: 1, _id: 0 }).explain('executionStats')`, type: 'NORMAL' },
        { num: 43, topic: 'Text Search (Q.3)', requirement: 'Find products where the name OR tags include the text "lossy" (case insensitive).', mysql: 'SELECT name FROM Products WHERE name LIKE \'%lossy%\' OR JSON_SEARCH(tags, \'one\', \'%lossy%\') IS NOT NULL;', mongo: `db.products.find({ $text: { $search: 'lossy' } }, { name: 1, _id: 0 })`, type: 'NORMAL' },
        { num: 48, topic: 'Set Intersection', requirement: 'Find users whose age is 30 AND whose city is "Mumbai".', mysql: 'SELECT name FROM Users WHERE age = 30 INTERSECT SELECT name FROM Users WHERE city = \'Mumbai\';', mongo: `db.users.find({ age: 30, city: 'Mumbai' }, { name: 1, _id: 0 })`, type: 'NORMAL' },
        { num: 51, topic: 'FIELD EXISTS', requirement: 'Find users who have a phone number field.', mysql: 'SELECT name FROM Users WHERE phone IS NOT NULL;', mongo: 'db.users.find({ phone: { $exists: true } }, { name: 1, _id: 0 })', type: 'NORMAL' },
        { num: 52, topic: 'NULL CHECK', requirement: 'Find users without phone numbers.', mysql: 'SELECT name FROM Users WHERE phone IS NULL;', mongo: 'db.users.find({ phone: null }, { name: 1, _id: 0 })', type: 'NORMAL' },
        { num: 53, topic: 'REGEX STARTS WITH', requirement: 'Find users whose name starts with "A".', mysql: 'SELECT name FROM Users WHERE name LIKE \'A%\';', mongo: 'db.users.find({ name: { $regex: \'^A\' } }, { name: 1, _id: 0 })', type: 'NORMAL' },
        { num: 54, topic: 'REGEX ENDS WITH', requirement: 'Find users whose name ends with "son".', mysql: 'SELECT name FROM Users WHERE name LIKE \'%son\';', mongo: 'db.users.find({ name: { $regex: \'son$\' } }, { name: 1, _id: 0 })', type: 'NORMAL' },
        { num: 55, topic: 'TODAYS ORDERS', requirement: 'Find orders placed today.', mysql: 'SELECT * FROM Orders WHERE DATE(order_date) = CURDATE();', mongo: 'db.orders.find({ order_date: { $gte: new Date(new Date().setHours(0,0,0,0)) } })', type: 'NORMAL' },
        { num: 56, topic: 'LAST 7 DAYS', requirement: 'Find orders from the last 7 days.', mysql: 'SELECT * FROM Orders WHERE order_date >= NOW() - INTERVAL 7 DAY;', mongo: 'db.orders.find({ order_date: { $gte: new Date(Date.now() - 7*86400000) } })', type: 'NORMAL' },
        { num: 57, topic: 'COUNT USERS', requirement: 'Count users from Mumbai.', mysql: 'SELECT COUNT(*) FROM Users WHERE city = \'Mumbai\';', mongo: 'db.users.countDocuments({ city: \'Mumbai\' })', type: 'NORMAL' },
        { num: 58, topic: 'EXCLUDE FIELD', requirement: 'List users except city field.', mysql: 'SELECT name, age FROM Users;', mongo: 'db.users.find({}, { city: 0 })', type: 'NORMAL' },
        { num: 59, topic: 'EVEN AGE USERS', requirement: 'Find users with even age.', mysql: 'SELECT name FROM Users WHERE age % 2 = 0;', mongo: 'db.users.find({ age: { $mod: [2, 0] } }, { name: 1, _id: 0 })', type: 'NORMAL' },
        { num: 60, topic: 'ARRAY HAS VALUE', requirement: 'Find products with "tech" tag.', mysql: 'SELECT name FROM Products WHERE JSON_CONTAINS(tags, \'["tech"]\');', mongo: 'db.products.find({ tags: \'tech\' }, { name: 1, _id: 0 })', type: 'NORMAL' },
        { num: 61, topic: 'ARRAY ELEMENT MATCH', requirement: 'Find products where at least one tag starts with t.', mysql: '(Complex JSON SQL)', mongo: 'db.products.find({ tags: { $elemMatch: { $regex: \'^t\' } } })', type: 'NORMAL' },
        { num: 62, topic: 'SORT + LIMIT', requirement: 'Get youngest user.', mysql: 'SELECT name FROM Users ORDER BY age ASC LIMIT 1;', mongo: 'db.users.find({}, { name: 1 }).sort({ age: 1 }).limit(1)', type: 'NORMAL' },
        { num: 63, topic: 'SKIP ONLY', requirement: 'Skip 5 users.', mysql: 'SELECT name FROM Users LIMIT 18446744073709551615 OFFSET 5;', mongo: 'db.users.find({}, { name: 1 }).skip(5)', type: 'NORMAL' },
        { num: 64, topic: 'MULTI SORT', requirement: 'Sort users by city asc and age desc.', mysql: 'SELECT name FROM Users ORDER BY city ASC, age DESC;', mongo: 'db.users.find({}, { name: 1 }).sort({ city: 1, age: -1 })', type: 'NORMAL' },
        { num: 65, topic: 'DISTINCT FILTER', requirement: 'Unique cities where department is Sales.', mysql: 'SELECT DISTINCT city FROM Users WHERE department=\'Sales\';', mongo: 'db.users.distinct(\'city\', { department: \'Sales\' })', type: 'NORMAL' },

        { num: 67, topic: 'RANGE DATE', requirement: 'Orders between two dates.', mysql: 'SELECT * FROM Orders WHERE order_date BETWEEN \'2024-05-01\' AND \'2024-05-15\';', mongo: 'db.orders.find({ order_date: { $gte: new Date(\'2024-05-01\'), $lte: new Date(\'2024-05-15\') } })', type: 'NORMAL' },
        { num: 68, topic: 'FIELD TYPE', requirement: 'Users where age is number.', mysql: '(Not supported)', mongo: 'db.users.find({ age: { $type: "number" } })', type: 'NORMAL' },
        { num: 69, topic: 'MULTI FIELD FILTER', requirement: 'Users older than 25 from Pune.', mysql: 'SELECT name FROM Users WHERE age>25 AND city=\'Pune\';', mongo: 'db.users.find({ age:{ $gt:25 }, city:\'Pune\' })', type: 'NORMAL' },
        { num: 70, topic: 'ARRAY SIZE GT', requirement: 'Products having more than 2 tags.', mysql: '(Complex JSON)', mongo: 'db.products.find({ $expr: { $gt: [ { $size: \'$tags\' }, 2 ] } })', type: 'NORMAL' },
        { num: 71, topic: 'TOP SALARY', requirement: 'Get highest salary user.', mysql: 'SELECT name FROM Users ORDER BY salary DESC LIMIT 1;', mongo: 'db.users.find({}, { name: 1 }).sort({ salary: -1 }).limit(1)', type: 'NORMAL' },
        { num: 72, topic: 'FIRST PAGE', requirement: 'Users page 1 size 5.', mysql: 'SELECT name FROM Users LIMIT 5;', mongo: 'db.users.find({}, { name:1 }).limit(5)', type: 'NORMAL' },
        { num: 73, topic: 'PAGINATION', requirement: 'Users page 2 size 5.', mysql: 'SELECT name FROM Users LIMIT 5 OFFSET 5;', mongo: 'db.users.find({}, { name:1 }).skip(5).limit(5)', type: 'NORMAL' },


        { num: 11, topic: 'INNER JOIN (Q.1)', requirement: 'Find the name and city of users who placed an order.', mysql: 'SELECT DISTINCT U.name, U.city FROM Users U INNER JOIN Orders O ON U.user_id = O.user_id;', mongo: `db.orders.aggregate([{ $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'userDetails' } }, { $unwind: '$userDetails' }, { $group: { _id: '$userDetails.name', city: { $first: '$userDetails.city' } } }, { $project: { _id: 0, name: '$_id', city: 1 } }])`, type: 'AGGREGATION' },
        { num: 12, topic: 'LEFT JOIN', requirement: 'List all users and show their last order ID (if they have one).', mysql: 'SELECT U.name, O.order_id FROM Users U LEFT JOIN Orders O ON U.user_id = O.user_id ORDER BY O.order_date DESC;', mongo: `db.users.aggregate([{ $lookup: { from: 'orders', localField: '_id', foreignField: 'user_id', as: 'orders' } }, { $unwind: { path: '$orders', preserveNullAndEmptyArrays: true } }, { $sort: { 'orders.order_date': -1 } }, { $group: { _id: '$_id', name: { $first: '$name' }, order_id: { $first: '$orders._id' } } }, { $project: { _id: 0, name: 1, order_id: 1 } }])`, type: 'AGGREGATION' },
        { num: 13, topic: 'JOIN 3 TABLES', requirement: 'Find the name of the product ordered by "Aarav Sharma".', mysql: 'SELECT P.name FROM Users U JOIN Orders O ON U.user_id = O.user_id JOIN Products P ON O.product_id = P.product_id WHERE U.name = \'Aarav Sharma\';', mongo: `db.users.aggregate([{ $match: { name: 'Aarav Sharma' } }, { $lookup: { from: 'orders', localField: '_id', foreignField: 'user_id', as: 'orders' } }, { $unwind: '$orders' }, { $lookup: { from: 'products', localField: 'orders.product_id', foreignField: '_id', as: 'productDetails' } }, { $unwind: '$productDetails' }, { $project: { _id: 0, productName: '$productDetails.name' } }])`, type: 'AGGREGATION' },
        { num: 14, topic: 'EMBEDDING Concept', requirement: 'In the Orders collection, fetch the order details for product 103 and embed the Product\'s name into the result (conceptual join).', mysql: '(Not applicable in SQL, as this models a document relationship)', mongo: `db.orders.aggregate([{ $match: { product_id: 103 } }, { $lookup: { from: 'products', localField: 'product_id', foreignField: '_id', as: 'productInfo' } }, { $unwind: '$productInfo' }, { $project: { _id: 1, order_date: 1, productName: '$productInfo.name' } }])`, type: 'AGGREGATION' },
        { num: 15, topic: 'COUNT JOIN', requirement: 'Count how many orders each user has placed.', mysql: 'SELECT U.name, COUNT(O.order_id) AS order_count FROM Users U LEFT JOIN Orders O ON U.user_id = O.user_id GROUP BY U.name;', mongo: `db.orders.aggregate([{ $group: { _id: '$user_id', orderCount: { $sum: 1 } } }, { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userDetails' } }, { $unwind: '$userDetails' }, { $project: { _id: 0, name: '$userDetails.name', order_count: '$orderCount' } }])`, type: 'AGGREGATION' },
        { num: 16, topic: 'COUNT', requirement: 'Find the total number of orders placed.', mysql: 'SELECT COUNT(*) AS total_orders FROM Orders;', mongo: 'db.orders.aggregate([{ $count: \'total_orders\' }])', type: 'AGGREGATION' },
        { num: 17, topic: 'GROUP BY (Q.1)', requirement: 'Count the number of users per city.', mysql: 'SELECT city, COUNT(user_id) AS user_count FROM Users GROUP BY city;', mongo: 'db.users.aggregate([{ $group: { _id: \'$city\', user_count: { $sum: 1 } } }])', type: 'AGGREGATION' },
        { num: 66, topic: 'REGEX', requirement: 'Names not containing \'art\'.', mysql: 'SELECT name FROM Users WHERE name NOT LIKE \'%art%\';', mongo: 'db.users.aggregate([{ $match: {  $not: { $name: "arti" , $options: "i" } } } , {$project : _id : 0 , name : 1}])', type: 'AGGREGATION' },
        { num: 18, topic: 'SUM', requirement: 'Calculate the total quantity of products sold.', mysql: 'SELECT SUM(quantity) AS total_quantity_sold FROM Orders;', mongo: `db.orders.aggregate([{ $group: { _id: null, total_quantity_sold: { $sum: '$quantity' } } }, { $project: { _id: 0, total_quantity_sold: 1 } }])`, type: 'AGGREGATION' },
        { num: 19, topic: 'AVG', requirement: 'Calculate the average age of users in the "Sales" department.', mysql: 'SELECT AVG(age) AS avg_sales_age FROM Users WHERE department = \'Sales\';', mongo: `db.users.aggregate([{ $match: { department: 'Sales' } }, { $group: { _id: null, avg_sales_age: { $avg: '$age' } } }, { $project: { _id: 0, avg_sales_age: 1 } }])`, type: 'AGGREGATION' },
        { num: 20, topic: 'MAX/MIN', requirement: 'Find the most expensive product\'s price.', mysql: 'SELECT MAX(price) FROM Products;', mongo: `db.products.aggregate([{ $group: { _id: null, max_price: { $max: '$price' } } }, { $project: { _id: 0, max_price: 1 } }])`, type: 'AGGREGATION' },
        { num: 21, topic: 'HAVING', requirement: 'Find cities where the number of users is greater than 1.', mysql: 'SELECT city, COUNT(user_id) FROM Users GROUP BY city HAVING COUNT(user_id) > 1;', mongo: `db.users.aggregate([{ $group: { _id: '$city', user_count: { $sum: 1 } } }, { $match: { user_count: { $gt: 1 } } }])`, type: 'AGGREGATION' },
        { num: 22, topic: 'GROUP/JOIN', requirement: 'Count the number of products sold per category.', mysql: 'SELECT P.category, SUM(O.quantity) AS total_sold FROM Orders O JOIN Products P ON O.product_id = P.product_id GROUP BY P.category;', mongo: `db.orders.aggregate([{ $lookup: { from: 'products', localField: 'product_id', foreignField: '_id', as: 'product' } }, { $unwind: '$product' }, { $group: { _id: '$product.category', total_sold: { $sum: '$quantity' } } }])`, type: 'AGGREGATION' },
        { num: 23, topic: 'DATE/MONTH', requirement: 'Calculate the total sales (quantity) for the month of May 2024.', mysql: 'SELECT SUM(quantity) AS may_sales FROM Orders WHERE MONTH(order_date) = 5 AND YEAR(order_date) = 2024;', mongo: `db.orders.aggregate([{ $match: { order_date: { $gte: new Date('2024-05-01'), $lt: new Date('2024-06-01') } } }, { $group: { _id: null, may_sales: { $sum: '$quantity' } } }, { $project: { _id: 0, may_sales: 1 } }])`, type: 'AGGREGATION' },
        { num: 24, topic: 'Nested Agg.', requirement: 'Find the city that has the oldest average age among its users.', mysql: 'SELECT city FROM Users GROUP BY city ORDER BY AVG(age) DESC LIMIT 1;', mongo: `db.users.aggregate([{ $group: { _id: '$city', avg_age: { $avg: '$age' } } }, { $sort: { avg_age: -1 } }, { $limit: 1 }])`, type: 'AGGREGATION' },
        { num: 32, topic: 'Correlated Subquery', requirement: 'Find users whose age is greater than the average age of all users.', mysql: 'SELECT name FROM Users WHERE age > (SELECT AVG(age) FROM Users);', mongo: `db.users.aggregate([{ $facet: { avgAge: [{ $group: { _id: null, avg: { $avg: '$age' } } }], users: [{ $match: {} }] } }, { $project: { users: { $filter: { input: '$users', as: 'user', cond: { $gt: ['$$user.age', { $arrayElemAt: ['$avgAge.avg', 0] }] } } } } }, { $unwind: '$users' }, { $project: { _id: 0, name: '$users.name' } }])`, type: 'AGGREGATION' },
        { num: 37, topic: 'Union/Merge', requirement: '(Conceptual) Combine results: all users from "Mumbai" and all users in "HR".', mysql: 'SELECT name FROM Users WHERE city = \'Mumbai\' UNION SELECT name FROM Users WHERE department = \'HR\';', mongo: `db.users.aggregate([{ $match: { $or: [{ city: 'Mumbai' }, { department: 'HR' }] } }, { $group: { _id: '$name' } }, { $project: { _id: 0, name: '$_id' } }])`, type: 'AGGREGATION' },
        { num: 38, topic: 'Conditional Agg.', requirement: 'Count the number of orders that are "Completed" and "Pending" separately in a single result.', mysql: 'SELECT status, COUNT(*) FROM Orders GROUP BY status;', mongo: `db.orders.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])`, type: 'AGGREGATION' },
        { num: 44, topic: 'Unwind/Flatten', requirement: 'Get a list of all individual unique tags used across all products.', mysql: '(Complex SQL using JSON_TABLE or recursive CTEs)', mongo: `db.products.aggregate([{ $unwind: '$tags' }, { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } }, { $project: { _id: 0, uniqueTags: 1 } }])`, type: 'AGGREGATION' },
        { num: 45, topic: 'Transactions', requirement: '(Conceptual) Start a multi-document transaction to update two users\' cities.', mysql: 'START TRANSACTION; UPDATE Users SET city=\'Pune\' WHERE user_id=1; UPDATE Users SET city=\'Pune\' WHERE user_id=2; COMMIT;', mongo: `session = db.getMongo().startSession(); \nsession.startTransaction(); \ntry { \n  session.getDatabase("test").users.updateOne({ _id: 1 }, { $set: { city: 'Pune' } }); \n  session.getDatabase("test").users.updateOne({ _id: 2 }, { $set: { city: 'Pune' } }); \n  session.commitTransaction(); \n} catch (e) { \n  session.abortTransaction(); \n}`, type: 'AGGREGATION' },
        { num: 46, topic: 'View/Out', requirement: 'Create a new collection/View containing only Completed orders.', mysql: 'CREATE VIEW Completed_Orders AS SELECT * FROM Orders WHERE status = \'Completed\';', mongo: `db.orders.aggregate([{ $match: { status: 'Completed' } }, { $out: 'Completed_Orders_Collection' }])`, type: 'AGGREGATION' },
        { num: 47, topic: 'Date Extraction', requirement: 'Group orders by the month they were placed.', mysql: 'SELECT YEAR(order_date), MONTH(order_date), COUNT(*) FROM Orders GROUP BY 1, 2;', mongo: `db.orders.aggregate([{ $group: { _id: { year: { $year: '$order_date' }, month: { $month: '$order_date' } }, count: { $sum: 1 } } }, { $sort: { '_id.year': 1, '_id.month': 1 } }])`, type: 'AGGREGATION' },
        { num: 49, topic: 'Conditional Projection', requirement: 'For all users, display the department. If the user is in "Sales", rename the field to "Sales_Team".', mysql: 'SELECT name, CASE WHEN department = \'Sales\' THEN \'Sales_Team\' ELSE department END AS Dept_Renamed FROM Users;', mongo: `db.users.aggregate([{ $project: { _id: 0, name: 1, Dept_Renamed: { $cond: { if: { $eq: ['$department', 'Sales'] }, then: 'Sales_Team', else: '$department' } } } }])`, type: 'AGGREGATION' },
        { num: 50, topic: 'Limit within Group', requirement: 'Find the most recent order for each user.', mysql: '(Requires Window Function like ROW_NUMBER() or complex subquery)', mongo: `db.orders.aggregate([{ $sort: { order_date: -1 } }, { $group: { _id: '$user_id', latestOrder: { $first: '$$ROOT' } } }, { $project: { _id: 0, user_id: '$_id', order_id: '$latestOrder._id', order_date: '$latestOrder.order_date' } }])`, type: 'AGGREGATION' },
        { num: 51, topic: 'DAILY SALES', requirement: 'Calculate total quantity sold per day.', mysql: `SELECT order_date, SUM(quantity) AS daily_sales FROM Orders GROUP BY order_date;`, mongo: `db.orders.aggregate([{ $group:{ _id:{ $dateToString:{ format:"%Y-%m-%d", date:"$order_date" } }, daily_sales:{ $sum:"$quantity" } } }])`, type: 'AGGREGATION' },
        { num: 52, topic: 'TOP CUSTOMER', requirement: 'Find the customer who placed the most orders.', mysql: `SELECT user_id, COUNT(*) AS count FROM Orders GROUP BY user_id ORDER BY count DESC LIMIT 1;`, mongo: `db.orders.aggregate([{ $group:{ _id:"$user_id", count:{ $sum:1 }}},{ $sort:{ count:-1 }},{ $limit:1 }])`, type: 'AGGREGATION' },
        { num: 53, topic: 'MOST SOLD PRODUCT', requirement: 'Find the product with the highest total quantity sold.', mysql: `SELECT product_id, SUM(quantity) AS total FROM Orders GROUP BY product_id ORDER BY total DESC LIMIT 1;`, mongo: `db.orders.aggregate([{ $group:{ _id:"$product_id", total:{ $sum:"$quantity" }}},{ $sort:{ total:-1 }},{ $limit:1 }])`, type: 'AGGREGATION' },
        { num: 54, topic: 'AVG PRODUCT PRICE', requirement: 'Category-wise average price.', mysql: `SELECT category, AVG(price) FROM Products GROUP BY category;`, mongo: `db.products.aggregate([{ $group:{ _id:"$category", avg_price:{ $avg:"$price" }} }])`, type: 'AGGREGATION' },
        { num: 55, topic: 'RANK USERS', requirement: 'Rank users by order count (Window Function).', mysql: `SELECT user_id, COUNT(*) AS count, RANK() OVER (ORDER BY COUNT(*) DESC) as order_rank FROM Orders GROUP BY user_id;`, mongo: `db.orders.aggregate([{ $group:{ _id:"$user_id", count:{ $sum:1 }}},{ $setWindowFields:{ sortBy:{ count:-1 }, output:{ rank:{ $rank:{} }}}}])`, type: 'AGGREGATION' },
        { num: 56, topic: 'STRING CONCAT', requirement: 'Create full name (assuming first and last name fields exist).', mysql: `SELECT CONCAT(first_name, ' ', last_name) AS fullName FROM Users;`, mongo: `db.users.aggregate([{ $project:{ _id:0, fullName:{ $concat:["$first_name"," ","$last_name"] }}}])`, type: 'AGGREGATION' },
        { num: 57, topic: 'LOW STOCK', requirement: 'Products with quantity less than 10 (assuming a stock field).', mysql: `SELECT name FROM Products WHERE stock < 10;`, mongo: `db.products.aggregate([{ $match:{ stock:{ $lt:10 }}}])`, type: 'AGGREGATION' },
        { num: 58, topic: 'ARRAY COUNT', requirement: 'Count the usage frequency of each tag.', mysql: `(Requires complex JSON unnesting)`, mongo: `db.products.aggregate([{ $unwind:"$tags" },{ $group:{ _id:"$tags", count:{ $sum:1 }}}])`, type: 'AGGREGATION' },
        { num: 59, topic: 'REMOVE ID', requirement: 'Hide id in aggregation result.', mysql: `SELECT name FROM Users;`, mongo: `db.users.aggregate([{ $project:{ _id:0, name:1 }}])`, type: 'AGGREGATION' },
        { num: 60, topic: 'NULL HANDLING', requirement: 'Replace null phone number with "Not Available".', mysql: `SELECT name, IFNULL(phone, 'Not Available') AS phone FROM Users;`, mongo: `db.users.aggregate([{ $project:{ _id:0, name:1, phone:{ $ifNull:["$phone","Not Available"]}}}])`, type: 'AGGREGATION' },
        { num: 61, topic: 'STRING TRIM', requirement: 'Trim extra spaces from the name field.', mysql: `SELECT TRIM(name) FROM Users;`, mongo: `db.users.aggregate([{ $project:{ _id:0, name:{ $trim:{ input:"$name"} }}}])`, type: 'AGGREGATION' },
        { num: 62, topic: 'FILTER ARRAYS', requirement: 'Return products showing only tags that contain "tech".', mysql: `(Requires advanced JSON filtering)`, mongo: `db.products.aggregate([{ $project:{ _id:0, name:1, tags:{ $filter:{ input:"$tags", as:"t", cond:{ $regexMatch:{ input:"$$t", regex:"tech"}}}}}}])`, type: 'AGGREGATION' },
        { num: 63, topic: 'TOP CATEGORY', requirement: 'Find the category with the maximum total quantity sold.', mysql: `SELECT P.category, SUM(O.quantity) AS total_qty FROM Orders O JOIN Products P ON O.product_id = P.product_id GROUP BY P.category ORDER BY total_qty DESC LIMIT 1;`, mongo: `db.orders.aggregate([{ $lookup:{ from:"products", localField:"product_id", foreignField:"_id", as:"p"}},{ $unwind:"$p"},{ $group:{ _id:"$p.category", qty:{ $sum:"$quantity"} }},{ $sort:{ qty:-1 }},{ $limit:1 }])`, type: 'AGGREGATION' },
        { num: 64, topic: 'MONTH NAME', requirement: 'Convert order month to string name (e.g., "May").', mysql: `SELECT MONTHNAME(order_date) AS month FROM Orders;`, mongo: `db.orders.aggregate([{ $project:{ _id:0, month:{ $dateToString:{ format:"%B", date:"$order_date"}}}}])`, type: 'AGGREGATION' },
        { num: 65, topic: 'ARRAY REDUCE', requirement: 'Calculate the total count of tags per document using reduce.', mysql: `(No direct equivalent; requires function or unnesting)`, mongo: `db.orders.aggregate([{ $project:{ _id:0, tagSum:{ $reduce:{ input:"$tags", initialValue:0, in:{ $add:["$$value",1]}}}}}])`, type: 'AGGREGATION' },
        { num: 66, topic: 'STRING SPLIT', requirement: 'Split the full name field into parts.', mysql: `SELECT SUBSTRING_INDEX(name, ' ', 1) as first, SUBSTRING_INDEX(name, ' ', -1) as last FROM Users;`, mongo: `db.users.aggregate([{ $project:{ _id:0, parts:{ $split:["$name"," "]}}}])`, type: 'AGGREGATION' },
        { num: 67, topic: 'COUNT DISTINCT USERS', requirement: 'Total unique ordering users.', mysql: `SELECT COUNT(DISTINCT user_id) FROM Orders;`, mongo: `db.orders.aggregate([{ $group:{ _id:"$user_id"}},{ $count:"unique_users"}])`, type: 'AGGREGATION' },
        { num: 68, topic: 'MAP ARRAY', requirement: 'Convert all tags to uppercase.', mysql: `(Requires complex JSON transformation)`, mongo: `db.products.aggregate([{ $project:{ _id:0, name:1, tags:{ $map:{ input:"$tags", as:"t", in:{ $toUpper:"$$t"}}}}}])`, type: 'AGGREGATION' },
        { num: 69, topic: 'REPLACE ROOT', requirement: 'Replace the entire document root with a sub-document (e.g., the "customer" field).', mysql: `(Not a native SQL concept)`, mongo: `db.orders.aggregate([{ $replaceRoot:{ newRoot:"$customer"} }])`, type: 'AGGREGATION' },
        { num: 70, topic: 'FIND MEDIAN', requirement: 'Find the median age (Conceptual setup).', mysql: `(Requires complex windowing/percentile functions)`, mongo: `db.users.aggregate([{ $sort:{ age:1 }}])`, type: 'AGGREGATION' },
        { num: 71, topic: 'PERCENT CALC', requirement: 'Calculate the percentage discount from price and discount amount (assuming field names).', mysql: `SELECT (discount / price) * 100 AS discount_percent FROM Products;`, mongo: `db.products.aggregate([{ $project:{ _id:0, name:1, discount_percent:{ $multiply:[{ $divide:["$discount","$price"]},100]}}}])`, type: 'AGGREGATION' },
        { num: 72, topic: 'GROUP FILTER', requirement: 'Filter groups where user has placed more than 5 orders.', mysql: `SELECT user_id FROM Orders GROUP BY user_id HAVING COUNT(*) > 5;`, mongo: `db.orders.aggregate([{ $group:{ _id:"$user_id", count:{ $sum:1}}},{ $match:{ count:{ $gt:5 }}}])`, type: 'AGGREGATION' },
        { num: 73, topic: 'COMBINED FACET', requirement: 'Calculate totals and retrieve sample data in a single pipeline.', mysql: `(Requires Complex SQL using subqueries or CTEs)`, mongo: `db.orders.aggregate([{ $facet:{ totals:[{ $group:{ _id:null, sum:{ $sum:"$quantity"}}}], data:[{ $limit: 3 },{ $project:{ product_id:1 }}]}}])`, type: 'AGGREGATION' },
        { num: 74, topic: 'YEAR GROUPING', requirement: 'Orders grouped yearly.', mysql: `SELECT YEAR(order_date), COUNT(*) FROM Orders GROUP BY YEAR(order_date);`, mongo: `db.orders.aggregate([{ $group:{ _id:{ $year:"$order_date"}, count:{ $sum:1}}}])`, type: 'AGGREGATION' },
        { num: 75, topic: 'PIPELINE SORT LIMIT', requirement: 'Top 5 expensive products.', mysql: `SELECT name, price FROM Products ORDER BY price DESC LIMIT 5;`, mongo: `db.products.aggregate([{ $sort:{ price:-1}}, { $limit:5}])`, type: 'AGGREGATION' },
        { num: 76, topic: 'BUCKET PRICE', requirement: 'Automatically categorize products into 4 price buckets.', mysql: `(Requires complex CASE WHEN logic)`, mongo: `db.products.aggregate([{ $bucketAuto:{ groupBy:"$price", buckets:4 }}])`, type: 'AGGREGATION' },
        { num: 77, topic: 'GRAPH LOOKUP', requirement: 'Find employee hierarchy (assuming managerId links to _id).', mysql: `(Requires Recursive Common Table Expressions - CTEs)`, mongo: `db.employees.aggregate([{ $graphLookup:{ from:"employees", startWith:"$managerId", connectFromField:"managerId", connectToField:"_id", as:"tree"}}])`, type: 'AGGREGATION' },
        { num: 78, topic: 'REGEX MATCH (Case-Insensitive Filter)', requirement: 'Filter orders only from users whose city starts with "M" or "C" (case-insensitive).', mysql: `SELECT * FROM Orders O JOIN Users U ON O.user_id = U.user_id WHERE U.city REGEXP '^[MC]';`, mongo: `db.orders.aggregate([{ $lookup:{ from:"users", localField:"user_id", foreignField:"_id", as:"user"}},{ $unwind:"$user"},{ $match:{ "user.city":{ $regex:"^[MC]", $options:"i" }}}])`, type: 'AGGREGATION' },
        { num: 79, topic: 'REGEX PROJECTION (Test & Flag)', requirement: 'Add a boolean flag "is_tech_product" if the product name contains "Keyboard" or "Mouse".', mysql: `SELECT name, name LIKE '%Keyboard%' OR name LIKE '%Mouse%' AS is_tech_product FROM Products;`, mongo: `db.products.aggregate([{ $project:{ _id:0, name:1, is_tech_product:{ $regexMatch:{ input:"$name", regex:"Keyboard|Mouse", options:"i"}}}}])`, type: 'AGGREGATION' },
        { num: 80, topic: 'REGEX GROUPING (Initial Letter)', requirement: 'Group users by the first letter of their name (case-insensitive).', mysql: `SELECT SUBSTRING(name, 1, 1) AS initial, COUNT(*) FROM Users GROUP BY initial;`, mongo: `db.users.aggregate([{ $group:{ _id:{ $toUpper:{ $substrCP:["$name",0,1]}}, count:{ $sum:1}}},{ $sort:{ _id:1 }}])`, type: 'AGGREGATION' },
    ];

    const formatMongoQuery = (mongoString) => {
        const pipelineMatch = mongoString.match(/\[(.*)\]/s);

        if (pipelineMatch) {
            try {
                const jsonLikeString = pipelineMatch[0]
                    .replace(/new Date\(['"](.*?)['"]\)/g, '"DATE_OBJ($1)"')
                    .replace(/\$\$(\w+)/g, '"$$$1"')
                    .replace(/\$/g, '$$')
                    .replace(/"\$\$(\w+)"/g, '$$$1')
                    .replace(/(\w+):/g, '"$1":')
                    .replace(/\"(\$?\w+)\"/g, '$1')
                    .replace(/'/g, '"');

                const finalPipelineContent = `[${pipelineMatch[1]}]`
                    .replace(/(\w+):/g, '"$1":')
                    .replace(/'/g, '"')
                    .replace(/\s\s+/g, ' ')
                    .replace(/(\$[a-zA-Z]+)(?=\:)/g, '"$1"')
                    .replace(/(\$ifNull)/g, '"$ifNull"')
                    .replace(/(\$concat)/g, '"$concat"')
                    .replace(/(\$add)/g, '"$add"')
                    .replace(/(\$dateToString)/g, '"$dateToString"')
                    .replace(/(\$first)/g, '"$first"')
                    .replace(/(\$setWindowFields)/g, '"$setWindowFields"')
                    .replace(/(\$rank)/g, '"$rank"')
                    .replace(/(\$divide)/g, '"$divide"')
                    .replace(/(\$multiply)/g, '"$multiply"')
                    .replace(/(\$filter)/g, '"$filter"')
                    .replace(/(\$regexMatch)/g, '"$regexMatch"');

                const pipelineArray = eval('(' + finalPipelineContent + ')');

                const prettyPrinted = JSON.stringify(pipelineArray, null, 2)
                    .replace(/\"DATE_OBJ\((.*?)\)\"/g, "new Date('$1')")
                    .replace(/"\$\$(\w+)"/g, "$$$$1")
                    .replace(/"\$\$(\w+)"/g, "$$$$1");

                return mongoString.split('[')[0].trim() + '(\n' + prettyPrinted + '\n)';
            } catch (e) {
                return mongoString
                    .replace(/,/g, ',\n  ')
                    .replace(/{/g, '{\n  ')
                    .replace(/}/g, '\n}');
            }
        }

        return mongoString;
    };

    const normalQueries = allQueries.filter(q => q.type === 'NORMAL');
    const aggQueries = allQueries.filter(q => q.type === 'AGGREGATION');


    const QueryList = ({ queries }) => (
        <div style={{ padding: '0 10px' }}>
            {queries.map((q) => (
                <div key={q.num} className="query-item" style={{ border: '1px solid #ddd', marginBottom: '20px', padding: '15px', borderRadius: '6px' }}>

                    <h2 className="method-title">
                        {q.num}. {q.requirement}
                    </h2>

                    <span className='subtitle'>( {q.topic} )</span>

                    <div className="query-solution-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        <div className="query-block">
                            <CodeBlock language="sql" style={atomDark}>
                                {q.mysql}
                            </CodeBlock>
                            <CodeBlock language="javascript" style={atomDark}>
                                {formatMongoQuery(q.mongo)}
                            </CodeBlock>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const getTabStyle = (tabName) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        fontWeight: "bold",
        color: activeTab === tabName ? '#e3e3e3' : '#4b5563',
        border: activeTab === tabName ? '1px solid #e3e3e3' : '3px solid transparent',
        transition: 'border-color 0.3s, color 0.3s',
        fontSize: '1.1em',
        borderRadius: "10px",
        margin: "10px",
        textAlign: 'center',
        flexGrow: 1
    });

    console.log(activeTab.trim().toLowerCase());

    return (
        <div className="debounce-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 className="title">IMP Interview Queries: Dual Solutions MySQl - MongoDB</h1>

            <div style={{ display: 'flex', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
                <div
                    style={getTabStyle('NORMAL')}
                    onClick={() => setActiveTab('NORMAL')}
                >
                    NORMAL {normalQueries.length}
                </div>
                <div
                    style={getTabStyle('AGGREGATION')}
                    onClick={() => setActiveTab('AGGREGATION')}
                >
                    AGGREGATION {aggQueries.length}
                </div>
            </div>

            <div className="method-section" style={{ padding: '0px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                {activeTab.trim().toLowerCase() === 'normal' && (
                    <QueryList title="Normal Queries" queries={normalQueries} />
                )}
                {activeTab.trim().toLowerCase() === 'aggregation' && (
                    <QueryList title="Aggregation Queries" queries={aggQueries} />
                )}
            </div>
        </div>
    );
}

export default IMPQueries;