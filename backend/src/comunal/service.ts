/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conee from 'src/db';
import * as mm from 'mysql2/promise'
import config from 'src/dbpar';
import conect from 'src/db_promise';


// const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async addComunal(tok: any, user_id) {
    let comunal = await this.getComunalMo(tok.flat_id, tok.comunal_name, tok.when_pay_y, tok.when_pay_m)
    if (comunal[0]) {
      let [rows, fields] = await (await conect).execute('UPDATE comunal SET flat_id = ?, user_id = ?, option_sendData = ?, comunal_name = ?, comunal_before = ?, comunal_now = ?, howmuch_pay = ?, consumed = ?, tariff = ?, calc_howmuch_pay = ?, about_pay = ? WHERE flat_id = ? AND comunal_name = ? AND when_pay_m = ? AND when_pay_y = ?;',
        [tok.flat_id, user_id, tok.comunal.option_sendData, tok.comunal_name, tok.comunal.comunal_before, tok.comunal.comunal_now, Number(tok.comunal.howmuch_pay), tok.comunal.consumed, Number(tok.comunal.tariff), Number(tok.comunal.calc_howmuch_pay), tok.comunal.about_pay, tok.flat_id, tok.comunal_name, tok.when_pay_m, tok.when_pay_y])
      return rows
    } else {
      let [rows, fields] = await (await conect).execute('INSERT INTO comunal (flat_id, user_id, comunal_name, option_sendData, comunal_before, comunal_now, howmuch_pay, when_pay_m, when_pay_y, consumed, tariff, calc_howmuch_pay, about_pay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [tok.flat_id, user_id, tok.comunal_name, tok.comunal.option_sendData, tok.comunal.comunal_before, tok.comunal.comunal_now, Number(tok.comunal.howmuch_pay), tok.when_pay_m, tok.when_pay_y, tok.comunal.consumed, Number(tok.comunal.tariff), Number(tok.comunal.calc_howmuch_pay), tok.comunal.about_pay])
      return rows
    }
  }

  async getComunalAll(flat_id: string, when_pay_m: number, when_pay_y: number) {
    let [rows, fields] = await (await conect).execute('SELECT * FROM comunal WHERE flat_id = ? AND when_pay_m = ? AND when_pay_y = ?;', [flat_id, when_pay_m, when_pay_y])
    if (rows[0] !== undefined) {
      return rows
    } else {
      return []
    }
  }

  async getComunalYearAll(flat_id: string, when_pay_y: number) {
    let [rows, fields] = await (await conect).execute('SELECT * FROM comunal WHERE flat_id = ? AND when_pay_y = ?;', [flat_id, when_pay_y])

    if (rows[0] !== undefined) {
      return rows
    } else {
      return []
    }
  }


  async getComunalMo(flat_id: string, comunal_name: string, when_pay_y: number, when_pay_m: string) {
    let [rows, fields] = await (await conect).execute('SELECT * FROM comunal WHERE flat_id = ? AND comunal_name = ? AND when_pay_y = ? AND when_pay_m = ?;', [flat_id, comunal_name, String(when_pay_y), when_pay_m])
    if (rows[0] !== undefined) {
      return rows
    }else{
      return []
    }
  }

  async addComunalName(flat_id: string, comunal_name: string) {
    let [rows, fields] = await (await conect).execute('SELECT * FROM comunal_name WHERE flat_id = ? AND comunal_name = ?;', [flat_id, comunal_name])
    if (rows[0] === undefined) {
      let [rows2, fields2] = await (await conect).execute('INSERT INTO comunal_name (flat_id, comunal_name) VALUES (?, ?)', [flat_id, comunal_name])
      return { status: "Данні по комуналці успішно змінені" }
    } else {
      return { status: "Данні по комуналці не змінені" }
    }
  }

  async addComunalCompany(tok: any) {
    let [rows, fields] = await (await conect).execute('SELECT * FROM comunal_name WHERE flat_id = ? AND comunal_name = ?;', [tok.flat_id, tok.comunal_name])
    if (rows[0] !== undefined) {
      let [rows, fields] = await (await conect).execute('UPDATE comunal_name SET comunal_company = ?, edrpo = ?, iban = ?, personalAccount = ?, comunal_address = ?, comunal_site = ?, comunal_phone = ?, about_comun = ? WHERE flat_id = ? AND comunal_name = ?;',
        [tok.comunal.comunal_company, tok.comunal.edrpo, tok.comunal.iban, tok.comunal.personalAccount, tok.comunal.comunal_address, tok.comunal.comunal_site, tok.comunal.comunal_phone, tok.comunal.about_comun, tok.flat_id, tok.comunal_name])
    } else {
      return { status: "Данні по комуналці не змінені" }
    }
  }


  async addComunalBefNow(tok: any) {
    let comunal = await this.getComunalMo(tok.flat_id, tok.comunal_name, tok.when_pay_y, tok.when_pay_m)
    if (comunal[0]) {
      let [rows, fields] = await (await conect).execute('UPDATE comunal SET comunal_before = ?, comunal_now = ?, option_sendData = ? WHERE flat_id = ? AND comunal_name = ? AND when_pay_m = ? AND when_pay_y = ?;',
        [tok.comunal.comunal_before, tok.comunal.comunal_now, tok.comunal.option_sendData, tok.flat_id, tok.comunal_name, tok.when_pay_m, tok.when_pay_y])
      return rows
    } else {
      let [rows, fields] = await (await conect).execute('INSERT INTO comunal (flat_id, comunal_name, comunal_before, comunal_now, when_pay_m, when_pay_y, option_sendData) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [tok.flat_id, tok.comunal_name, tok.comunal.comunal_before, tok.comunal.comunal_now, tok.when_pay_m, tok.when_pay_y, tok.comunal.option_sendData])
      return rows
    }
  }

  async getComunalYear(flat_id: string, comunal_name: string, when_pay_y: number) {
    let [rows, fields]:[any, any] = await (await conect).execute('SELECT * FROM comunal WHERE flat_id = ? AND comunal_name = ? AND when_pay_y = ?;', [flat_id, comunal_name, when_pay_y])
    let gg = []
    await Promise.all(rows.map(async(i:any) => {
      let [rows2, fields2] = await (await conect).execute('SELECT img FROM comunal_img WHERE flat_id = ? AND comunal_name = ? AND when_pay_y = ? AND when_pay_m = ?;', [flat_id, i.comunal_name, String(i.when_pay_y), i.when_pay_m])
      i.img = rows2[0]
      gg.push(i)
    }))
    if (rows[0] !== undefined) {
      return gg
    } else {
      return []
    }
  }

  async getComunalName(flat_id: string) {
    let [rows, fields] = await (await conect).execute('SELECT * FROM comunal_name WHERE flat_id = ?;', [flat_id])
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    }
  }

  async deleteComunal(flat_id: any, comunal_name : string) {
    try{
      await (await conect).execute('DELETE FROM comunal WHERE flat_id = ? AND comunal_name = ?;', [flat_id, comunal_name])
      await (await conect).execute('DELETE FROM comunal_name WHERE flat_id = ? AND comunal_name = ?;', [flat_id, comunal_name])
    }catch{
      return false
    }
    
  return true
  }

}