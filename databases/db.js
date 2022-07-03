
import { Sequelize } from 'sequelize';
import { Database, OPEN_READWRITE } from "sqlite3";

export const DB_NAME = './todo.db'
export const TABLE_TODO = 'todos';
export const SEQUELIZE = new Sequelize({
    dialect: 'sqlite',
    storage: DB_NAME
});


export const DB = new Database(DB_NAME, OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        console.log('SQLITE_CANTOPEN')
    } else if (err) {
        console.log("Getting error " + err);
    }
})

// var results = await new Promise((resolve, reject) => {
//     DB.all('SELECT * FROM todos', (error, rows) => {
//         if (error) return reject(error)
//         resolve(rows)
//     })
// })