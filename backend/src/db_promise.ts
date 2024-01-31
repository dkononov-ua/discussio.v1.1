/* eslint-disable prettier/prettier */
import * as mmm from 'mysql2/promise'
import config from './dbpar'


// const config = {
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: 'y4kQuRF<ct?O0',
//     insecureAuth: true,
//     database: 'users9000',

// }

// const conect = mmm.createConnection(config)

const conect2 = mmm.createPool(config)

export default conect2