/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conee from 'src/db';
import * as mm from 'mysql2/promise'

const config = {
  host: 'mysql',
  user: 'root',
  password: 'discuss32144',
  insecureAuth: true,
  database: "disscussio_beta_1",
}



const conect = mm.createConnection(config)



@Injectable()
export class Service {



}