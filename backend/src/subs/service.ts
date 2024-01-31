/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';


// const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async countSubs(flat_id: string){
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute("SELECT COUNT(*) AS total FROM subscribes WHERE flat_id = ?", [flat_id])
    conect.release();
    if (rows[0] !== undefined) {
      return rows[0].total
    } else {
      return false
    }
  }

  async getFlatforSubs(flat_id: string) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute("SELECT flat.flat_id, flat.flat_name, flat.country, flat.region, flat.city, flat.street, \
    flat.houseNumber, flat.apartment, flat.flat_index, flat.distance_metro, \
    flat.distance_stop, flat.distance_shop, flat.distance_green, flat.distance_parking, \
    about.woman, about.man, about.family, about.students, about.animals, about.bunker, about.option_pay, about.price_m, \
    about.price_d, about.about, parametrs.rooms, parametrs.repair_status, parametrs.area, \
    parametrs.kitchen_area, parametrs.balcony, parametrs.floor FROM flat \
    JOIN parametrs ON flat.flat_id = parametrs.flat_id JOIN about ON flat.flat_id = about.flat_id \
    WHERE about.rent = 1 AND flat.flat_id = ?", [flat_id])
    let [img, fie]: [Array<any> | any, any] = await conect.execute("SELECT * FROM flat_img WHERE flat_id = ?", [flat_id])
    conect.release();
    if (rows[0] !== undefined) {
      return { flat: rows[0], img: await Promise.all(img.map((i: any) => i.img)) }
    } else {
      return false
    }
  }


  async getIDFlats(user_id: string, offs: string) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('SELECT flat_id FROM subscribes WHERE user_id = ? LIMIT 10 OFFSET ?;', [user_id, offs.toString()])
    conect.release();
    if (rows[0] !== undefined) {
      return rows
    } else {
      return []
    }
  }

  async getSubs(user_id: string) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute("SELECT users.user_id, users.firstName, users.lastName, users.surName, \
    contacts.viber, contacts.instagram, contacts.telegram, contacts.facebook, user_img.img \
    FROM users JOIN contacts ON users.user_id = contacts.user_id \
    JOIN user_img ON users.user_id = user_img.user_id WHERE users.user_id = ?", [user_id])
    conect.release();
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return [{ status: 'Немає підписників' }]
    }
  }

  async getIDSubs(flat_id: string, offs: number) {
    const conect = await conect2.getConnection();
    const [rows, fields] = await conect.execute("SELECT * FROM subscribes WHERE flat_id = ? LIMIT 10 OFFSET ?;", [flat_id, offs.toString()])
    conect.release();
    if (rows[0] !== undefined) {
      return rows
    } else {
      return []
    }
  }

  async subscribes(user_id: string, flat_id: string) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('SELECT * FROM subscribes WHERE flat_id = ? AND user_id = ?;', [flat_id, user_id])
    conect.release();
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }

  async countYSubs(user_id: string){
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute("SELECT COUNT(*) AS total FROM subscribes WHERE user_id = ?", [user_id])
    conect.release();
    if (rows[0] !== undefined) {
      return rows[0].total
    } else {
      return false
    }
  }


}