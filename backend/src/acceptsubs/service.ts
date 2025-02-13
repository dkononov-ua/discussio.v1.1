/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';


@Injectable()
export class Service {

    async getIDAccSubs(flat_id: string, offs: string) {
      const conect = await conect2.getConnection();
      try{
        let [rows, fields] = await conect.execute('SELECT user_id FROM accept_subs WHERE flat_id = ? LIMIT 10 OFFSET ?;', [flat_id, offs.toString()])
        if (rows[0] !== undefined) {
          return rows
        } else {
          return []
        }
      }catch(err){
        console.log(err)
        return []
      }finally{conect.release();}

    }

    async getAccSubs(user_id: string) {
      const conect = await conect2.getConnection();
      try{
        let [rows, fields] = await conect.execute("SELECT users.user_id, users.firstName, users.lastName, users.surName, \
        contacts.viber, contacts.instagram, contacts.telegram, contacts.facebook, contacts.tell, contacts.mail, user_img.img, features.country, features.region, features.city, features.distance_metro, features.distance_stop,\
        features.distance_shop, features.distance_green, features.distance_parking, features.woman, features.man, features.about, features.family,\
        features.students, features.animals, features.bunker, features.option_pay, features.price_of, features.price_to, features.house,\
        features.room, features.flat, features.agree_search, features.looking_woman, features.looking_man, features.rooms_of, features.metroname, features.metrocolor, features.floor, features.district, features.micro_district,\
        features.rooms_to, features.repair_status, features.area_of, features.area_to, features.balcony, features.purpose_rent, features.days,\
        features.weeks, features.mounths, features.years, features.day_counts, user_status.realll, user_status.checked \
        FROM users JOIN contacts ON users.user_id = contacts.user_id JOIN features ON users.user_id = features.user_id \
        JOIN user_img ON users.user_id = user_img.user_id JOIN user_status ON users.user_id = user_status.user_id WHERE users.user_id = ?", [user_id])
        
        if (rows[0] !== undefined) {
          return rows[0]
        } else {
          return [{ status: 'Немає підтверджених підписників' }]
        }
      }catch(err){
        console.log(err)
        return [{ status: 'Немає підтверджених підписників' }]}finally{conect.release();}

    }

    async getIDAccFlats(user_id: string, offs: string) {
      const conect = await conect2.getConnection();
      try{
        let [rows, fields] = await conect.execute('SELECT flat_id FROM accept_subs WHERE user_id = ? LIMIT 10 OFFSET ?;', [user_id, offs.toString()])
        if (rows[0] !== undefined) {
          return rows
        } else {
          return []
        }
      }catch(err){
        console.log(err)
        return []}finally{conect.release();}

    }


    async countYdisc(flat_id: string){
      const conect = await conect2.getConnection();
      try{
        let [rows, fields] = await conect.execute("SELECT COUNT(*) AS total FROM accept_subs WHERE flat_id = ?", [flat_id])
        if (rows[0] !== undefined) {
          return rows[0].total
        } else {
          return false
        }
      }catch(err){
        console.log(err)
        return false}finally{conect.release();}

    }

    async countDisc(user_id: string){
      const conect = await conect2.getConnection();
      try{
        let [rows, fields] = await conect.execute("SELECT COUNT(*) AS total FROM accept_subs WHERE user_id = ?", [user_id])
        
        if (rows[0] !== undefined) {
          return rows[0].total
        } else {
          return false
        }
      }catch(err){
        console.log(err)
        return false}finally{conect.release();}

    }


}