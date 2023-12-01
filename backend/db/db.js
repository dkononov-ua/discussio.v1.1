import { config } from './config.js'
import mysql from 'mysql'



const con = mysql.createConnection(config)


// Створити базу данних
con.connect(function(err) {
    if (err) throw err;
    con.query("CREATE DATABASE IF NOT EXISTS users322", function (err, result) {
    if (err) throw err;})
    con.end()
})

