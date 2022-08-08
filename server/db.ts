import Knex from 'knex'



const knex = Knex({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME

    },migrations: {
        tableName: "knex_migrations"
    }
})

export default knex;