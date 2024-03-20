# Queries and Mutations

---

## Add admin and new user

---

```json
mutation{
  addAdmin(name:"salman",email:"salman@786",password:"salman"){
    id
    name
    isAdmin
  }
   addUser(name:"salman",email:"salman@786",password:"salman"){
    id
    name
    isAdmin
  }
}
```

## Login and generate token, logout

---

```json
mutation{
  loginUser(email:"akash@786",password:"akash"){
    token
  }
}
mutation{
  logout
}
```

## Add books by admin only

---

```json
mutation{
  addBooks(name:"book1",author:"author1"){
    id
    name
    isAvailable
  }
}
```

## Query books all, available, by ID

---

```json
query{
  availableBooks{
    id
    isAvailable
  }
}
query{
  books{
    id
    isAvailable
  }
}
query{
  book(id:1){
    id
    isAvailable
  }
}
```

## Borrow or buy

```json
mutation{
  borrowBook(id:1){
    id
    isAvailable
  }
}
mutation{
  buyBook(id:1){
    id
    isAvailable
  }
}
```
