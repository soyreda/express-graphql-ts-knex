import express from "express"
import "dotenv/config"
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLInt, GraphQLList, GraphQLScalarType } from "graphql";
import knex from "./db"


const app = express();


interface Author {
    id: number,
    name: string, 
    country: string,
    created_at? : any,
    updated_at? : any,
}

interface Book{
    id: number, 
    bookName: string, 
    year: number, 
    authorId: number
}
// [
//     RowDataPacket {
//       id: 7,
//       name: 'yourauthor3',
//       country: 'CA',
//       created_at: null,
//       updated_at: null
//     }
//   ]

// const authors = [
//     {
//         id: 1,
//         name: "reda",
//         country: "MA"
//     }, 
//     {
//         id: 2,
//         name: "beda",
//         country: "USA"
//     }
// ]

// const books = [
//     {
//         id: 1, 
//         bookName: "bookName1",
//         year: 2012,
//         authorId: 2
//     },
//     {
//         id: 2,
//         bookName: "bookName2",
//         year: 2013,
//         authorId: 1
//     }
// ]


  const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        country: {type: GraphQLString},
        Books: {
            type: new GraphQLList(BookType),
            resolve: ({id}) => {
                // return books.filter((book) => book.authorId === id)
                let books = knex<Book>('books').select().where('authorId', id)
                return books;

            }
        }
    })
  })

  const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLInt},
        bookName: { type: GraphQLString},
        year: { type: GraphQLInt},
        authorId: { type: GraphQLInt}
    })
  })


  const RootQuery = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLInt}
            },
            resolve: async (_, {id}) => {
                let author = await knex<Author>('authors').select().where("id", id)
                return author[0]
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve: async () => {
                let authors = await knex<Author>('authors').select()
                return authors
            }
        },
        book: {
            type: BookType,
            args: {
                // id: {type: GraphQLInt},
                name: { type: GraphQLString}
            },
            resolve: async (_, {name}) => {
                // return books.find((book) => (id === book.id) || (name === book.bookName))
                let book = await knex<Book>('books').select().where("bookName", name)
                return book[0]
            }
        }, 

        books: {
            type: new GraphQLList(BookType),
            description: "get a list of books",
            resolve: async () => {
                let books = await knex<Book>('books').select()
                return books 
            }
        }
        
    })
  })

  const  RootMutation = new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
        addAuthor: {
            type: AuthorType,
            args: {
                // id: {type: GraphQLInt}
                name: {type: GraphQLString},
                country: {type: GraphQLString}
            },
            resolve: async (_, { name, country}) => {
                let newAuthor = {name, country};
                let newId = await knex<Author>('authors').insert(newAuthor)
                let addedAuthor = await knex<Author>('authors').select().where('id', newId)

                return addedAuthor[0]
                // knex<Author>('authors').insert()
                // authors.push({id: authors.length + 1,name,country})
                // return authors[authors.length - 1];
            }
        },

        addBook: {
            type: BookType,
            args: {
                // id: {type: GraphQLInt},
                bookName: {type: GraphQLString},
                year: {type: GraphQLInt},
                authorId: {type: GraphQLInt}
            },
            resolve: async (_, {bookName, year, authorId}) => {

                let newBook = {bookName, year, authorId}
                let newId = await knex<Book>('books').insert(newBook)
                let addedBook = await knex<Book>('books').select().where('id', newId)

                return addedBook[0]
                // books.push({id: books.length + 1, bookName, year, authorId})
                // return books[books.length - 1]
            }
        }
    })
  })

  const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
  })
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  );

  app.get("/", (req, res) => {
    res.redirect("/graphql")
  })

  app.listen(process.env.PORT, () => {console.log(process.env.PORT)})

