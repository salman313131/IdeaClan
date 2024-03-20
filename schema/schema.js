const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, 
    GraphQLList, GraphQLBoolean, GraphQLNonNull, GraphQLUnionType, GraphQLEnumType, GraphQLInt } = require('graphql')
const UserModel = require('../models/User')
const BookModel = require('../models/Book')
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const { addToBlacklist } = require('../middleware/blacklist');

const User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        isAdmin: {type: GraphQLBoolean}
    })
})

const OwnerType = new GraphQLEnumType({
    name:'ownerType',
    values: {
        OWNED: {value:'owned'},
        BORROWED: {value:'borrowed'},
        FREE: {value:'free'},
    }
})

const Book = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        author: {type: GraphQLString},
        isAvailable: {type: GraphQLBoolean},
        owner: {
            type: User,
            resolve: async(parent, args)=>{
                try {
                    if(!parent.userId){
                        return null
                    }
                    const user = await UserModel.findByPk(parent.userId)
                    return user
                } catch (error) {
                    throw new Error("Some Error occured : ",error)
                }
            }},
        ownerType:{
            type: OwnerType
        }
    })
})


//Query
const Query = new GraphQLObjectType({
    name:'Query',
    fields: {
        books:{
            type: new GraphQLList(Book),
            resolve:async(parent,args,context)=>{
                const user =  context.user;
                if(!user){
                    throw new Error("Login to access books")
                }
                const books = await BookModel.findAll()
                return books
            }
        },
        availableBooks:{
            type: new GraphQLList(Book),
            resolve:async(parent,args,context)=>{
                const user =  context.user;
                if(!user){
                    throw new Error("Login to access books")
                }
                const books = await BookModel.findAll({where:{ownerType:'free'}})
                return books
            }
        },
        book:{
            type: Book,
            args:{ 
                column: {type: GraphQLString},
                value: {type: GraphQLString}},
            resolve: async (parent,args)=>{
                const user =  context.user;
                if(!user){
                    throw new Error("Login to access book")
                }
                const book = await BookModel.findOne({[args.column]:args.value});
                return book
            }
        },
        users:{
            type: new GraphQLList(User),
            resolve(parent,args, context){
                const user =  context.user;
                if(!user.isAdmin){
                    throw new Error("Only admin can access users")
                }
                return UserModel.findAll()
            }
        },
        user:{
            type: User,
            args:{ id: {type: GraphQLID}},
            resolve(parent, args){
                return UserModel.findByPk(args.id);
            } 
        }
    }
})

//AuthPayloadType
const AuthPayload = new GraphQLObjectType({
    name:'AuthPayload',
    fields:{
        user: {type: User},
        token: {type: GraphQLString}
    }
})

//Mutations
const Mutation = new GraphQLObjectType({
    name:'mutation',
    fields:{
        addUser:{
            type: User,
            args: {
                name:{type:GraphQLNonNull(GraphQLString)},
                email:{type:GraphQLNonNull(GraphQLString)},
                password:{type:GraphQLNonNull(GraphQLString)},
            },
            resolve: async (parent,args)=>{
                try {
                    const saltRounds = 10;
                    const hashPassword = await bcrypt.hash(args.password,saltRounds);
                    const user = await UserModel.create({
                        name:args.name,
                        email:args.email,
                        password:hashPassword,
                        isAdmin:false
                    })
                    return user
                } catch (error) {
                    console.log(error);
                    throw new Error("Falied to create user: ", error.message);
                }
            }
        },
        loginUser:{
            type: AuthPayload,
            args:{
                email:{type:GraphQLNonNull(GraphQLString)},
                password:{type:GraphQLNonNull(GraphQLString)}, 
            },
            resolve:async(parent,args)=>{
                try {
                    const user = await UserModel.findOne({email:args.email});
                    if(!user){
                        throw new Error("User not found");
                    }
                    const passwordMatch = await bcrypt.compare(args.password,user.password);
                    if(!passwordMatch){
                        throw new Error("Password Incorrect")
                    }
                    const data={
                        userId:user.id,
                        isAdmin:user.isAdmin
                    }
                    const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '2h' })
                    return {user,token}
                } catch (error) {
                    console.log(error);
                    throw new Error("Falied to login user: ", error.message);
                }
            }
        },
        logout:{
            type: GraphQLString,
            resolve:(parent,args,context)=>{
                const token = context.token;
                addToBlacklist(token);
                return "LogOut"
            }
        },
        addBooks:{
            type: Book,
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                author:{type:GraphQLNonNull(GraphQLString)},
            },
            resolve:async (parent,args,context)=>{
                try {
                    const user =  context.user;
                    if(!user.isAdmin){
                        throw new Error("Only admin can add new Books")
                    }
                    const book = await BookModel.create({name:args.name,author:args.author})
                    return book                    
                } catch (error) {
                    console.log(error)
                    throw new Error("Falied to add book: ", error.message);
                }
            }
        },
        deleteBook:{
            type: GraphQLInt,
            args:{
                id:{type:GraphQLNonNull(GraphQLID)},
            },
            resolve:async (parent,args,context)=>{
                try {
                    const user =  context.user;
                    if(!user.isAdmin){
                        throw new Error("Only admin can add delete Books")
                    }
                    const book = await BookModel.destroy({id:args.id})
                    return book                    
                } catch (error) {
                    console.log(error)
                    throw new Error("Falied to add book: ", error.message);
                }
            }
        },
        borrowBook:{
            type: Book,
            args:{
                id:{type:GraphQLNonNull(GraphQLID)},
            },
            resolve:async (parent,args,context)=>{
                try {
                    const user =  context.user;
                    if(!user){
                        throw new Error("Login to borrow books")
                    }
                    const fetchBook = await BookModel.findByPk(args.id)
                    if(fetchBook.userId){
                        throw new Error(`Book was borrowed by user with id:${fetchBook.userId}`)
                    }
                    const book = await BookModel.update({userId:user.id,isAvailable:false,ownerType:'borrowed'}
                                                        , {where:{id:args.id}})
                    return book                    
                } catch (error) {
                    console.log(error)
                    throw new Error("Falied to add book: ", error.message);
                }
            }
        },
        buyBook:{
            type: Book,
            args:{
                id:{type:GraphQLNonNull(GraphQLID)},
            },
            resolve:async (parent,args,context)=>{
                try {
                    const user =  context.user;
                    if(!user){
                        throw new Error("Login to buy books")
                    }
                    const fetchBook = await BookModel.findByPk(args.id)
                    if(fetchBook.userId){
                        throw new Error(`Book was bought by user with id:${fetchBook.userId}`)
                    }
                    const book = await BookModel.update({userId:user.id,isAvailable:false,ownerType:'owned'},
                                                        {where:{id:args.id}})
                    return book                    
                } catch (error) {
                    console.log(error)
                    throw new Error("Falied to add book: ", error.message);
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})