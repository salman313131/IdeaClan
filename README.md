# IDEACLAN

---

Simple backend surver for library system with Users and Books as entity. Admin user can add books to the library. User can either borrow or buy books from the library. User can request to borrow books from other users.

## AWS Link

---

http://3.110.44.20:4000/

## QUICKSTART

---

```bash
#install dependecies
$ npm install
#run the server
$ npm start
#server has started you can verify by using the ruru-server middleware for UI
```

## Features

---

- User Authentication: Users can securely authenticate themselves using their email and password. Json web token is used.
- Book Creation: Admin can create new book entries by providing relevant information such as title, author.
- Book Deletion: Admin can delete existing book entries if they are no longer needed.
- Book Purchase: Users can purchase books from the available books they want to buy.
- Book Borrowing: Users can borrow books from, after which they must return them.
- Book requesting: Users can request the books from other user

## Technology Used

---

- Backend: Node.js, Express.js, graphql, ruru-server
- Database: mysql
- Authentication: JSON Web Tokens (JWT)
- Password Hashing: Bcrypt
