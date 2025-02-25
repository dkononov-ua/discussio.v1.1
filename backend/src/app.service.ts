/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';


@Injectable()
export class AppService {

  async getUserParams(user_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields]:[Array<any> | any, any] = await (conect).execute(`SELECT user_id, add_in_flat FROM user_parametrs WHERE user_id = ? LIMIT 1`, [user_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return  false 
      }
    }catch(err){
      console.log(err)
      return  false 
    }finally{conect.release();}
    
  }

  async getAgentFLS(user_id: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await (conect).execute('SELECT firstName, lastName, surName FROM users WHERE user_id = ?;', [user_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return undefined
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}

  }

  
  async countSearch(query: string, params : any){
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await (conect).execute(query, params)
      if (rows[0] !== undefined) {
        return rows[0].total
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}

  }

  async agent(flat_id: string){
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT * FROM citizen WHERE flat_id = ? AND acces_agent = TRUE;', [flat_id])
      let [rows2, fields2] = await conect.execute('SELECT user_status.realll, user_status.checked, users.user_id FROM users JOIN user_status ON users.user_id = user_status.user_id WHERE users.user_id = ?;', [rows[0].user_id])

      if (rows2[0] !== undefined) {
        return rows2[0]
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}

  }

  async getFlatOwner(flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT owner_id FROM flat WHERE flat_id = ?', [flat_id])
      let [rows2, fields2] = await conect.execute('SELECT user_status.realll, user_status.checked, users.user_id FROM users JOIN user_status ON users.user_id = user_status.user_id WHERE users.user_id = ?;', [rows[0].owner_id])

      if (rows2[0] !== undefined) {
        return rows2[0]
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
  }

  // async flatCheck2(user_id: string, flat_id: string) {
  //   const conect = await conect2.getConnection();
  //   let [rows, fields] = await conect.execute('SELECT * FROM flat WHERE flat_id = ? AND owner_id = ?;', [flat_id, user_id])
  //   conect.release();
  //   if (rows[0] !== undefined) {
  //     return rows[0]
  //   } else {
  //     return false
  //   }
  // }


  async flatRentCheck(flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT * FROM about WHERE flat_id = ? AND rent = 1;', [flat_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
  }


  async getComunalNameDiscuss(flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT comunal_name FROM comunal_name WHERE flat_id = ?;', [flat_id])
      if (rows[0] !== undefined) {
        return rows
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
  }


  async getFlatName(flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT flat_name FROM flat WHERE flat_id = ? LIMIT 1;', [flat_id])
      if (rows[0] !== undefined) {
        return rows[0].flat_name
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
  }


  async getFlatforAccSubs(flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT flat.flat_id, flat.flat_name, flat.country, flat.region, flat.city, flat.street, \
      flat.houseNumber, flat.apartment, flat.flat_index, flat.distance_metro, \
      flat.distance_stop, flat.distance_shop, flat.distance_green, flat.distance_parking, flat.district, flat.micro_district, \
      about.woman, about.man, about.family, about.students, about.animals, about.bunker, about.price_m, about.option_pay, parametrs.option_flat, about.room, \
      about.price_d, about.about, parametrs.rooms, parametrs.repair_status, parametrs.area, parametrs.metroname, parametrs.metrocolor, parametrs.floorless, \
      parametrs.kitchen_area, parametrs.balcony, parametrs.floor, flat_status.realll, flat_status.checked FROM flat \
      JOIN parametrs ON flat.flat_id = parametrs.flat_id JOIN about ON flat.flat_id = about.flat_id JOIN flat_status ON flat.flat_id = flat_status.flat_id \
      WHERE flat.flat_id = ?", [flat_id])
      let [img, fie]: [Array<any> | any, any] = await conect.execute("SELECT * FROM flat_img WHERE flat_id = ?", [flat_id])
      let agent_id  = await this.agent(flat_id)
      if (agent_id) {
        let user = await this.getAccSubsFlat(agent_id.user_id)
        return { flat: rows[0], img: await Promise.all(img.map((i: any) => i.img)), owner: user }
      } else {
        let [owner_id, fff]: [Array<any> | any, any] = await conect.execute("SELECT owner_id FROM flat WHERE flat_id = ?", [flat_id])
        let user = await this.getAccSubsFlat(owner_id[0].owner_id)
        return { flat: rows[0], img: await Promise.all(img.map((i: any) => i.img)), owner: user }
      }  
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
  }

  async getFlatforUserSubs(flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT flat.flat_id, flat.flat_name, flat.country, flat.region, flat.city, flat.street, \
      flat.houseNumber, flat.apartment, flat.flat_index, flat.distance_metro, flat.district, flat.micro_district, \
      flat.distance_stop, flat.distance_shop, flat.distance_green, flat.distance_parking, \
      about.woman, about.man, about.family, about.students, about.animals, about.bunker, about.price_m, parametrs.option_flat, about.room, about.option_pay, \
      about.price_d, about.about, parametrs.rooms, parametrs.repair_status, parametrs.area, parametrs.metroname, parametrs.metrocolor, parametrs.floorless, \
      parametrs.kitchen_area, parametrs.balcony, parametrs.floor, flat_status.realll, flat_status.checked FROM flat \
      JOIN parametrs ON flat.flat_id = parametrs.flat_id JOIN about ON flat.flat_id = about.flat_id JOIN flat_status ON flat.flat_id = flat_status.flat_id \
      WHERE flat.flat_id = ?", [flat_id])
      let [img, fie]: [Array<any> | any, any] = await conect.execute("SELECT * FROM flat_img WHERE flat_id = ?", [flat_id])
      let agent_id  = await this.agent(flat_id)
      if (agent_id) {
        let user = await this.getAccSubs(agent_id.user_id)
        return { flat: rows[0], img: await Promise.all(img.map((i: any) => i.img)), owner: user }
      } else {
        let [owner_id, fff]: [Array<any> | any, any] = await conect.execute("SELECT owner_id FROM flat WHERE flat_id = ?", [flat_id])
        let user = await this.getAccSubs(owner_id[0].owner_id)
        return { flat: rows[0], img: await Promise.all(img.map((i: any) => i.img)), owner: user }
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
  }

  async getFlatforCitizen(flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT flat.flat_id, flat.flat_name, flat.country, flat.region, flat.city, flat.street, \
    flat.houseNumber, flat.apartment, flat.flat_index, flat.distance_metro,  flat.district, flat.micro_district, \
    flat.distance_stop, flat.distance_shop, flat.distance_green, flat.distance_parking, parametrs.metroname, parametrs.metrocolor, parametrs.floorless, \
    about.woman, about.man, about.family, about.students, about.animals, about.bunker, about.price_m, parametrs.option_flat, about.room, about.option_pay, \
    about.price_d, about.about, parametrs.rooms, parametrs.repair_status, parametrs.area, flat_status.realll, flat_status.checked, \
    parametrs.kitchen_area, parametrs.balcony, parametrs.floor FROM flat \
    JOIN parametrs ON flat.flat_id = parametrs.flat_id JOIN about ON flat.flat_id = about.flat_id JOIN flat_status ON flat.flat_id = flat_status.flat_id \
    WHERE flat.flat_id = ?", [flat_id])
    let [img, fie]: [Array<any> | any, any] = await conect.execute("SELECT * FROM flat_img WHERE flat_id = ?", [flat_id])
    let agent_id  = await this.agent(flat_id)
    if (agent_id) {
      let user = await this.getAccSubsFlat(agent_id.user_id)
      return { flat: rows[0], img: await Promise.all(img.map((i: any) => i.img)), owner: user }
    } else {
      let [owner_id, fff]: [Array<any> | any, any] = await conect.execute("SELECT owner_id FROM flat WHERE flat_id = ?", [flat_id])
      let user = await this.getAccSubsFlat(owner_id[0].owner_id)
      return { flat: rows[0], img: await Promise.all(img.map((i: any) => i.img)), owner: user }
    }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
    
  }


  async getAccSubs(user_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT users.user_id, users.firstName, users.lastName, users.surName, \
      contacts.viber, contacts.instagram, contacts.telegram, contacts.facebook, contacts.tell, contacts.mail, user_img.img, features.country, features.region, features.city, features.distance_metro, features.distance_stop,\
      features.distance_shop, features.distance_green, features.distance_parking, features.woman, features.man, features.about, features.family,\
      features.students, features.animals, features.bunker, features.option_pay, features.price_of, features.price_to, features.house, features.district, features.micro_district,\
      features.room, features.flat, features.agree_search, features.looking_woman, features.looking_man, features.rooms_of, features.metroname, features.metrocolor, features.floor,\
      features.rooms_to, features.repair_status, features.area_of, features.area_to, features.balcony, features.purpose_rent, features.days,\
      features.weeks, features.mounths, features.years, features.day_counts, user_status.realll, user_status.checked \
      FROM users JOIN contacts ON users.user_id = contacts.user_id JOIN features ON users.user_id = features.user_id JOIN user_status ON users.user_id = user_status.user_id \
      JOIN user_img ON users.user_id = user_img.user_id WHERE users.user_id = ?", [user_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return [{ status: 'Немає підтверджених підписників' }]
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
    
  }

  async getAccSubsFlat(user_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT users.user_id, users.firstName, users.lastName, users.surName, \
      contacts.viber, contacts.instagram, contacts.telegram, contacts.facebook, contacts.tell, contacts.mail, user_img.img, user_status.realll, user_status.checked \
      FROM users JOIN contacts ON users.user_id = contacts.user_id JOIN user_status ON users.user_id = user_status.user_id \
      JOIN user_img ON users.user_id = user_img.user_id WHERE users.user_id = ?", [user_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return [{ status: 'Немає підтверджених підписників' }]
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
    
  }

  // async citizen2(user_id: string, flat_id: string) {
  //   const conect = await conect2.getConnection();
  //   let [rows, fields] = await conect.execute('SELECT * FROM citizen WHERE flat_id = ? AND user_id = ?;', [flat_id, user_id])
  //   conect.release();
  //   if (rows[0] !== undefined) {
  //     return rows[0]
  //   } else {
  //     return false
  //   }
  // }


  async accept_subs(user_id: string, flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT * FROM accept_subs WHERE flat_id = ? AND user_id = ?;', [flat_id, user_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
    
  }


  // async authentification2(tok: any) {
  //   const conect = await conect2.getConnection();
  //   let [rows, fields] = await conect.execute('SELECT * FROM users WHERE user_mail = ? AND password = ?;', [tok.email, tok.password])
  //   conect.release();
  //   if (rows[0] !== undefined) {
  //     return rows[0]
  //   } else {
  //     return undefined
  //   }
  // }



  // Продублювати перевірку на забаненість
  async authentification(tok: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT * FROM users JOIN user_status ON users.user_id = user_status.user_id WHERE users.user_mail = ? AND users.password = ?;', [tok.email, tok.password])
      if (rows[0] !== undefined && (rows[0].banned == 0 || rows[0].owner == 1)) {
        return rows[0]
      } else {
        return undefined
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
    
  }


  async login(tok: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT * FROM users JOIN user_status ON users.user_id = user_status.user_id WHERE users.user_mail = ? AND users.password = ?;', [tok.email, tok.password])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return undefined
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
    
  }

  async citizen(user_id: string, flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT * FROM citizen WHERE flat_id = ? AND user_id = ?;', [flat_id, user_id])
      let [rows2, fields2] = await conect.execute('SELECT * FROM flat_status WHERE flat_id = ?;', [flat_id])
    if (rows[0] !== undefined && rows2[0].banned == 0) {
      return rows[0]
    } else {
      return false
    }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
    
  }


  async flatCheck(user_id: string, flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT * FROM flat WHERE flat_id = ? AND owner_id = ?;', [flat_id, user_id])
      let [rows2, fields2] = await conect.execute('SELECT * FROM flat_status WHERE flat_id = ?;', [flat_id])
      if (rows[0] !== undefined && rows2[0].banned == 0) {
        return rows[0]
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();} 
  }

 
}
