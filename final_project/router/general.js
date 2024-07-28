const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const Username = req.body.username;
  const Password = req.body.password;
  if(!Username || !Password){
    return res.status(404).json({message: "Invalid: username or password not provided"});
  }else{
    let user = users.filter((user)=>(
        user.username === Username
    ))
    if(user.length > 0){
        return res.status(404).json({message: "Invalid: username already exists"});
    }else{
        users.push({"username": Username, "password": Password})
        return res.status(200).json({message: "User registered successfully"});
    }
  }
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        try{
            let bookList = [];
            Object.values(books).map((element)=>(
                bookList.push(element["title"])
            ))
            resolve(bookList);
        }catch(error){
            reject("Error!")
        } 
    })
    myPromise.then((bookList)=>{
        return res.send(JSON.stringify(bookList));
    })
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        try{
            let ISBN  = req.params.isbn;
            const book = books[ISBN];
            resolve(book);
        }catch(error){
            reject("Error occured")
        } 
    })
    myPromise.then((book)=>{
        if(book){
            return res.send(JSON.stringify(book))
        }else{
            return res.status(404).json({message: "Book doesn't exists with given isbn"})
        } 
    })   
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        try{
            let Author  = req.params.author.replace(/[:\\"]/g,'');
            let book =  Object.values(books).filter((element)=>(
                element["author"]===Author
            ))
            resolve(book);
        }catch(error){
            reject("Error occured")
        } 
    })
    myPromise.then((book)=>{
        if(book.length>0){
            return res.send(JSON.stringify(book))
        }else{
            return res.status(404).json({message: "Book doesn't exists"})
        } 
    })  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
        let myPromise = new Promise((resolve,reject) => {
            try{
                let Title  = req.params.title.replace(/[:\\"]/g,'');
                let book =  Object.values(books).filter((element)=>(
                    element["title"]===Title
                ))
                resolve(book);
            }catch(error){
                reject("Error occured")
            } 
        })
        myPromise.then((book)=>{
            if(book.length>0){
                return res.send(JSON.stringify(book))
            }else{
                return res.status(404).json({message: "Book doesn't exists"})
            } 
        })  
    });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let ISBN  = req.params.isbn;
    if(books[ISBN]){
        if(books[ISBN]["reviews"].length > 0){
            return res.send(JSON.stringify(books[ISBN]))
        }else{
            return res.status(200).json({message: "No reviews available"})
        }
        
    }else{
        return res.status(404).json({message: "Book doesn't exists with given ISBN"})
    }
});


module.exports.general = public_users;
