const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, 
    GraphQLList, GraphQLBoolean } = require('graphql')
const client = require('../server');
const UserModel = require('../models/User')
const BookModel = require('../models/Book')

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

const Book = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        author: {type: GraphQLString},
        addBy: {
            type: User,
            resolve(parent,args){
                return User.findByPk(parent.addedBy)
            }},
        ownedBy: {
            type: User,
            resolve(parent,args){
                return User.findByPk(parent.owner)
            }},
        availableForBorrow: {type: GraphQLBoolean}
    })
})

const Query = new GraphQLObjectType({
    name:'Query',
    fields: {
        books:{
            type: new GraphQLList(Book),
            resolve(parent,args){
                return BookModel.findAll()
            }
        },
        book:{
            type: Book,
            args:{ id: {type: GraphQLID}},
            resolve(parent,args){
                return BookModel.findByPk(args.id);
            }
        },
        users:{
            type: new GraphQLList(User),
            resolve(parent,args){
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

module.exports = new GraphQLSchema({
    query: Query
})