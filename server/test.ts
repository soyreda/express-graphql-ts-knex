import knex from './db'

type test = {
    name: string, 
    age: number,
}
knex<test>('test').insert({name: 'reda', age: 22 }).then(r => console.log("added succesffully"))
.catch(r => console.log('failed'))