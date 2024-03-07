/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';


// const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async addAgreement(tok: any, owner_id: string, flat_id: string) {
    try {
      const conect = await conect2.getConnection();
      let [rows1, fields1] = await conect.execute('SELECT * FROM agreement WHERE flat_id = ? AND subscriber_id = ? AND owner_id = ? AND i_agree IS NULL', [flat_id, tok.subscriber.user_id, owner_id])
      if(rows1 !== undefined){
        let [rows, fie] = await conect.execute(`
      INSERT INTO agreement (agreement_id, subscriber_id, subscriber_firstName, subscriber_lastName, subscriber_surName, subscriber_email,
        subscriber_tell, owner_id, owner_firstName, owner_lastName, owner_surName, owner_email,
        owner_tell, flat_id, agreementDate, city, street, houseNumber,
        apartment, rent_due_data, penalty,
        max_penalty, price, area, subscriber_img, owner_img, ownership, dateAgreeStart, dateAgreeEnd, transferHouse, whoPayComun, depositPayment, dateAgreeBreakUp,
        numberVisits, personsReside, vacateHouse, option_flat, room, floor, about_agree, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        owner_id + flat_id + tok.subscriber.user_id + tok.terms.agreementDate,
        tok.subscriber.user_id,
        tok.subscriber.firstName,
        tok.subscriber.lastName,
        tok.subscriber.surName,
        tok.subscriber.mail,
        tok.subscriber.tell,
        owner_id,
        tok.owner.firstName,
        tok.owner.lastName,
        tok.owner.surName,
        tok.owner.mail,
        tok.owner.tell,
        flat_id,
        tok.terms.agreementDate,
        tok.house.city,
        tok.house.street,
        tok.house.houseNumber,
        tok.house.apartment,
        tok.terms.rent_due_data,
        tok.terms.penalty,
        tok.terms.max_penalty,
        tok.house.price,
        tok.house.area,
        tok.subscriber.subscriber_img,
        tok.owner.owner_img, tok.house.ownership, tok.terms.dateAgreeStart, tok.terms.dateAgreeEnd, tok.terms.transferHouse, 
        tok.terms.whoPayComun, tok.terms.depositPayment, tok.terms.dateAgreeBreakUp, tok.terms.numberVisits, tok.terms.personsReside,
        tok.terms.vacateHouse,
        tok.house.option_flat, tok.house.room, tok.house.floor, tok.terms.about, new Date()
      ]
      );
      conect.release();
      if (rows !== undefined) {
        return true;
      } else {
        return false;
      }
    }else{
      conect.release();
      return {status: "Договір вже існує"}
    }} catch (err) {
      return false
    }
  }

  async getAgreement(agreement_id: string, flat_id: string, user_id: string) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('SELECT * FROM agreement WHERE agreement_id = ? AND flat_id = ? AND subscriber_id = ?', [agreement_id, flat_id, user_id])
    conect.release();
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }


  async getUserAgreement(flat_id: string, user_id: string, offs: string) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('SELECT * FROM agreement WHERE flat_id = ? AND subscriber_id = ? LIMIT 10 OFFSET ?', [flat_id, user_id, offs.toString()])
    conect.release();
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    }
  }

  async getAllAgreement(flat_id: string, offs: string) {
    const conect = await conect2.getConnection();
    let [rows, fields]:[Array<any> | any, any] = await conect.execute(`SELECT DISTINCT flat_id, agreement_id, subscriber_id, subscriber_firstName, subscriber_lastName, subscriber_surName, subscriber_email,
    subscriber_tell,  owner_id, owner_firstName, owner_lastName,  owner_surName, owner_email,
    owner_tell, flat_id, agreementDate, city, street, houseNumber,
    apartment, rent_due_data, penalty, ownership, dateAgreeStart, dateAgreeEnd, transferHouse, whoPayComun, depositPayment, dateAgreeBreakUp, numberVisits, personsReside, vacateHouse,
    max_penalty, price, area, subscriber_img, owner_img, i_agree, option_flat, room, floor, about_agree, data FROM agreement WHERE flat_id = ? AND i_agree IS NULL LIMIT 10 OFFSET ?`, [flat_id, offs.toString()])
    if (rows[0] !== undefined) {

      const a = await Promise.all(rows.map(async (e) => {
        let [img, fie]: [Array<any> | any, any] = await conect.execute("SELECT * FROM flat_img WHERE flat_id = ?", [e.flat_id])
        // let[agent_id, ff] :[ Array<any> | any, any] = await conect).execute("SELECT agent_id FROM flat WHERE flat_id = ?", [flat_id])
        if (img) {
          return { flat: e, img: await Promise.all(img.map((i: any) => i.img))}
        } else {
          return e
        }
      }))
      conect.release();
      return a
    } else {
      conect.release();
      return  false 
    }
  }


  async getAllYAgreement(user_id: string, offs: string) {
    const conect = await conect2.getConnection();
    let [rows, fields]:[Array<any> | any, any] = await conect.execute(`SELECT DISTINCT flat_id, agreement_id, subscriber_id, subscriber_firstName, subscriber_lastName, subscriber_surName, subscriber_email,
    subscriber_tell,  owner_id, owner_firstName, owner_lastName,  owner_surName, owner_email,
    owner_tell, flat_id, agreementDate, city, street, houseNumber,
    apartment, rent_due_data, penalty, ownership, dateAgreeStart, dateAgreeEnd, transferHouse, whoPayComun, depositPayment, dateAgreeBreakUp, numberVisits, personsReside, vacateHouse,
    max_penalty, price, area, subscriber_img, owner_img, option_flat, room, floor, about_agree, data FROM agreement WHERE subscriber_id = ? AND i_agree IS NULL LIMIT 10 OFFSET ?`, [user_id, offs.toString()])
    
    if (rows[0] !== undefined) {
      return await Promise.all(rows.map(async (e) => {
        let [img, fie]: [Array<any> | any, any] = await conect.execute("SELECT * FROM flat_img WHERE flat_id = ?", [e.flat_id])
        conect.release();
        // let[agent_id, ff] :[ Array<any> | any, any] = await conect).execute("SELECT agent_id FROM flat WHERE flat_id = ?", [flat_id])
        if (img) {
          return { flat: e, img: await Promise.all(img.map((i: any) => i.img))}
        } else {
          return e
        }
      }))
    } else {
      conect.release();
      return false
    }
  }


  async getAllSaveAgreement(flat_id: string, offs: string) {
    const conect = await conect2.getConnection();
    let [rows, fields]:[Array<any> | any, any] = await conect.execute(`SELECT DISTINCT flat_id, agreement_id, subscriber_id, subscriber_firstName, subscriber_lastName, subscriber_surName, subscriber_email,
    subscriber_tell,  owner_id, owner_firstName, owner_lastName,  owner_surName, owner_email,
    owner_tell, flat_id, agreementDate, city, street, houseNumber,
    apartment, rent_due_data, penalty, ownership, dateAgreeStart, dateAgreeEnd, transferHouse, whoPayComun, depositPayment, dateAgreeBreakUp, numberVisits, personsReside, vacateHouse,
    max_penalty, price, area, subscriber_img, owner_img, option_flat, room, floor, about_agree, data FROM agreement WHERE flat_id = ? AND i_agree = true LIMIT 10 OFFSET ?`, [flat_id, offs.toString()])
    if (rows[0] !== undefined) {
      return await Promise.all(rows.map(async (e) => {
        let [img, fie]: [Array<any> | any, any] = await conect.execute("SELECT * FROM flat_img WHERE flat_id = ?", [e.flat_id])
        conect.release();
        // let[agent_id, ff] :[ Array<any> | any, any] = await conect).execute("SELECT agent_id FROM flat WHERE flat_id = ?", [flat_id])
        if (img) {
          return { flat: e, img: await Promise.all(img.map((i: any) => i.img))}
        } else {
          return e
        }
      }))
    } else {
      conect.release();
      return false 
    }
  }


  async getAllSaveYAgreement(user_id: string, offs: string) {
    const conect = await conect2.getConnection();
    let [rows, fields]:[Array<any> | any, any] = await conect.execute(`SELECT DISTINCT flat_id, agreement_id, subscriber_id, subscriber_firstName, subscriber_lastName, subscriber_surName, subscriber_email,
    subscriber_tell,  owner_id, owner_firstName, owner_lastName,  owner_surName, owner_email,
    owner_tell, flat_id, agreementDate, city, street, houseNumber,
    apartment, rent_due_data, penalty, ownership, dateAgreeStart, dateAgreeEnd, transferHouse, whoPayComun, depositPayment, dateAgreeBreakUp, numberVisits, personsReside, vacateHouse,
    max_penalty, price, area, subscriber_img, owner_img, option_flat, room, floor, about_agree, data FROM agreement WHERE subscriber_id = ? AND i_agree = true LIMIT 10 OFFSET ?`, [user_id, offs.toString()])
    if (rows[0] !== undefined) {
      return await Promise.all(rows.map(async (e) => {
        let [img, fie]: [Array<any> | any, any] = await conect.execute("SELECT * FROM flat_img WHERE flat_id = ?", [e.flat_id])
        conect.release();
        // let[agent_id, ff] :[ Array<any> | any, any] = await conect).execute("SELECT agent_id FROM flat WHERE flat_id = ?", [flat_id])
        if (img) {
          return { flat: e, img: await Promise.all(img.map((i: any) => i.img))}
        } else {
          return e
        }
      }))
    } else {
      conect.release();
      return false
    }
  }


  async addAct(tok: any, agreement_id: string, flat_id: string) {
    try {
      const conect = await conect2.getConnection();
      let [rows1, fields1] = await conect.execute('SELECT * FROM agreement WHERE agreement_id = ? AND flat_id = ?', [agreement_id, flat_id])
      let [aaa, fff] = await conect.execute('SELECT * FROM agreement_act WHERE agreement_id = ?', [agreement_id])
      let [aaa2, fff2] = await conect.execute('SELECT * FROM agreement_filling WHERE agreement_id = ? LIMIT 1', [agreement_id])
      if(rows1 !== undefined && aaa[0] === undefined){
        let [rows, fields3] = await conect.execute(`INSERT INTO agreement_act (agreement_id, electro, cold_water, hot_water, gas) VALUES (?, ?, ?, ?, ?)`,
        [agreement_id, tok.counter.electro, tok.counter.cold_water, tok.counter.hot_water, tok.counter.gas]);
        await Promise.all(tok.filling.map(async(i :any)=>{
          let [rows4, fields2] = await conect.execute(`INSERT INTO agreement_filling (agreement_id, type_filling, number_filling, condition_filling, img, about_filling, name_filling) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [agreement_id, i.type_filling, i.number_filling, i.condition_filling, i.img, i.about_filling, i.name_filling])
        }))
        conect.release();
        if (rows !== undefined) {
          return true;
        } else {
          return false;
        }
    }else if(rows1 !== undefined && aaa[0] !== undefined && aaa2 === undefined ){
      await Promise.all(tok.filling.map(async(i :any)=>{
        let [rows4, fields2] = await conect.execute(`INSERT INTO agreement_filling (agreement_id, type_filling, number_filling, condition_filling, img, about_filling, name_filling) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [agreement_id, i.type_filling, i.number_filling, i.condition_filling, i.img, i.about_filling, i.name_filling])
      }))
      conect.release();
      return true; 
    }
    conect.release();
  } catch (err) {
      return {status: "Акт вже існує"}
    }
  }


  async getAct(agreement_id: string, flat_id: string) {
    const conect = await conect2.getConnection();
    let [rows1, fields1] = await conect.execute('SELECT * FROM agreement WHERE agreement_id = ? AND flat_id = ?', [agreement_id, flat_id])
    if(rows1 !== undefined){
      let [rows, fields] = await conect.execute('SELECT * FROM agreement_act WHERE agreement_id = ?', [agreement_id])
      let [rows3, fields3] = await conect.execute('SELECT * FROM agreement_filling WHERE agreement_id = ?', [agreement_id])
      conect.release();
    if (rows[0] !== undefined) {
      return [rows[0], rows3]
    } else {
      return false
    }
    }else{
      conect.release();
      return false
    }
    
  }


}