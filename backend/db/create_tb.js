import { config } from './config.js'
import mysql from 'mysql'


config.database = "users322"
const con = mysql.createConnection(config)
const users = [['Denis', 1, 'Den@gmail.com','12345678'],['Vitia',2,'ZXC@gmail.com','12345678']]


// Створити базу данних
con.connect((err)=> {
    var sql = "CREATE TABLE IF NOT EXISTS users (name VARCHAR(255), id INT, email VARCHAR(255), password VARCHAR(255))";
    con.query(sql, (err, result)=> {
        if (err) throw err;
    });
    con.query("INSERT INTO users (name, id, email, password) VALUES ?", [users], (err, result)=> {
        if (err) throw err;
    });
    con.end()    
})


// const conee = mysql.createConnection(config)
// conee.connect()
// conee.query('SELECT * FROM users WHERE name = "Vitia"', async (error, results, fields)=> {
//     console.log(results)
//     if (error) throw error;  
// })

// conee.end()

