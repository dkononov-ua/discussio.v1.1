/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conee from 'src/db';
import * as mm from 'mysql2/promise'
import config from 'src/dbpar';


const conect = mm.createConnection(config)


// const conect = mm.createConnection(config)



@Injectable()
export class Service {


    async getAgreement(flat_id: string, user_id: string) {
        let [rows, fields] = await (await conect).execute('SELECT * FROM agreement WHERE flat_id = ? AND subscriber_id = ?', [flat_id, user_id])
        if (rows[0] !== undefined) {
          return rows
        } else {
          return false
        }
    }

    // async addUserRating(info : any) {
    //     let agrmn:any = await this.getAgreement(info.flat_id, info.user_id)
    //     if(agrmn){
    //         const millisecondsInDay = 24 * 60 * 60 * 1000;
    //         let da : any = new Date()
    //         let rating_data : any = new Date(info.mark.data)
    //         const dataaaa = da - rating_data
    //         const Difference = dataaaa / millisecondsInDay;
    //         if(Difference < 45){
    //             let chosen_agre : any
    //             agrmn.map((item : any)=>{
    //                 const timeDifference = da - item.data;
    //                 const daysDifference = timeDifference / millisecondsInDay;
    //                 if(daysDifference > 40){
    //                     chosen_agre = item
    //                 }else{
    //                     return
    //                 }
    //                 })
    //             if(chosen_agre){
    //                 let startAgree = new Date(chosen_agre.dateAgreeStart)
    //                 let startEnd = new Date(chosen_agre.dateAgreeEnd)
    //                 if(da > startAgree && da < startEnd){
    //                     let chosen_date = new Date(info.mark.data).getMonth() + 1
    //                     let [u_rati, f] : [any, any] = await (await conect).execute('SELECT * FROM user_rating WHERE user_id = ? AND flat_id = ? AND MONTH(data) = ?', [info.user_id, info.flat_id, chosen_date])
    //                     if(u_rati){
    //                         await (await conect).execute('UPDATE user_rating SET data = ?, mark = ?, about = ? WHERE user_id = ? AND flat_id = ?',
    //                         [info.mark.data, info.mark.mark, info.mark.about, info.user_id, info.flat_id])
    //                         return true
    //                     }else{
    //                         await (await conect).execute('INSERT INTO user_rating (user_id, data, flat_id, mark, about) VALUES (?, ?, ?, ?, ?)',
    //                         [info.user_id, info.mark.data, info.flat_id, info.mark.mark, info.mark.about])
    //                         return true
    //                     }
    //                 }else{
    //                     return "Ви не підпадаєте під дати договору"
    //                 }
    //             }else{
    //                 return "Підходящого договору не існує"
    //             }
    //         }else{
    //             return "Нажаль данну оцінку не змінити"
    //         }
    //     }else{
    //         return "Ви не можете виставити рейтинг даному користувачу"
    //     }
    // }


    // async addFlatRating(info : any, user_id : any) {
    //     let agrmn:any = await this.getAgreement(info.flat_id, user_id)
    //     if(agrmn){
    //         const millisecondsInDay = 24 * 60 * 60 * 1000;
    //         let da : any = new Date()
    //         let rating_data : any = new Date(info.mark.data)
    //         const dataaaa = da - rating_data
    //         const Difference = dataaaa / millisecondsInDay;
    //         if(Difference < 45){
    //             let chosen_agre : any
    //             agrmn.map((item : any)=>{
    //                 const timeDifference = da - item.data;
    //                 const daysDifference = timeDifference / millisecondsInDay;
    //                 if(daysDifference > 40){
    //                     chosen_agre = item
    //                 }else{
    //                     return
    //                 }
    //                 })
    //             if(chosen_agre){
    //                 let startAgree = new Date(chosen_agre.dateAgreeStart)
    //                 let startEnd = new Date(chosen_agre.dateAgreeEnd)
    //                 if(da > startAgree && da < startEnd){
    //                     let chosen_date = new Date(info.mark.data).getMonth() + 1
    //                     let [u_rati, f] : [any, any] = await (await conect).execute('SELECT * FROM flat_rating WHERE flat_id = ? AND user_id = ? AND MONTH(data) = ?', [info.flat_id, user_id, chosen_date])
    //                     if(u_rati){
    //                         await (await conect).execute('UPDATE flat_rating SET data = ?, mark = ?, about = ? WHERE flat_id = ? AND user_id = ?',
    //                         [info.mark.data, info.mark.mark, info.mark.about, info.flat_id, user_id])
    //                         return true 
    //                     }else{
    //                         await (await conect).execute('INSERT INTO flat_rating (user_id, data, flat_id, mark, about) VALUES (?, ?, ?, ?, ?)',
    //                         [user_id, info.mark.data, info.flat_id, info.mark.mark, info.mark.about])
    //                         return true
    //                     }
    //                 }else{
    //                     return "Ви не підпадаєте під дати договору"
    //                 }
    //             }else{
    //                 return "Підходящого договору не існує"
    //             }
    //         }else{
    //             return "Нажаль данну оцінку не змінити"
    //         }
    //     }else{
    //         return "Ви не можете виставити рейтинг даній оселі"
    //     }
    // }

    async addFlatsRating(info : any, user_id : any) {
        let agrmn:any = await this.getAgreement(info.flat_id, user_id)
        
        if(agrmn){
            const millisecondsInDay = 24 * 60 * 60 * 1000;
            let da : any = new Date()
            let rating_data : any = new Date(info.date)
            const dataaaa = da - rating_data
            const Difference = dataaaa / millisecondsInDay;
            if(Difference < 45){
                let chosen_agre : any
                await Promise.all(agrmn.map(async (item : any)=>{
                    let [rows2, fields2] = await (await conect).execute('SELECT * FROM agreement_act WHERE agreement_id = ?', [item.agreement_id])
                    const timeDifference = da - item.data;
                    const daysDifference = timeDifference / millisecondsInDay;
                    // Виправити - 40 на 30
                    if(daysDifference > -40 && rows2[0]){
                        chosen_agre = item
                    }else{
                        return
                    }
                    }))
                if(chosen_agre){
                    let startAgree = new Date(chosen_agre.dateAgreeStart)
                    let startEnd = new Date(chosen_agre.dateAgreeEnd)
                    if(rating_data > startAgree && rating_data < startEnd){
                        let chosen_date = rating_data.getMonth() + 1
                        
                        let [u_rati, f] : [any, any] = await (await conect).execute('SELECT * FROM owner_rating WHERE user_id = ? AND appraiser = ? AND MONTH(data) = ?', [chosen_agre.owner_id, chosen_agre.subscriber_id, chosen_date])
                        if(u_rati[0]){
                            await (await conect).execute('UPDATE owner_rating SET data = ?, mark = ?, about = ? WHERE appraiser = ? AND user_id = ? AND MONTH(data) = ?',
                            [rating_data, info.mark, info.about, chosen_agre.subscriber_id, chosen_agre.owner_id, chosen_date])
                            return true 
                        }else{
                            await (await conect).execute('INSERT INTO owner_rating (user_id, data, appraiser, mark, about) VALUES (?, ?, ?, ?, ?)',
                            [chosen_agre.owner_id, rating_data, chosen_agre.subscriber_id, info.mark, info.about])
                            return true
                        }
                    }else{
                        return "Ви не підпадаєте під дати договору"
                    }
                }else{
                    return "Підходящого договору не існує"
                }
            }else{
                return "Нажаль данну оцінку не змінити"
            }
        }else{
            return "Ви не можете виставити рейтинг даній оселі"
        }
    }

    async addUsersRating(info : any) {
        let agrmn:any = await this.getAgreement(info.flat_id, info.user_id)
        if(agrmn){
            const millisecondsInDay = 24 * 60 * 60 * 1000;
            let da : any = new Date()
            let rating_data : any = new Date(info.date)
            const dataaaa = da - rating_data
            const Difference = dataaaa / millisecondsInDay;
            if(Difference < 45){
                let chosen_agre : any
                await Promise.all(agrmn.map(async (item : any)=>{
                    let [rows2, fields2] = await (await conect).execute('SELECT * FROM agreement_act WHERE agreement_id = ?', [item.agreement_id])
                    let aaaa : any = new Date(item.data)
                    const timeDifference = da - aaaa;
                    const daysDifference = timeDifference / millisecondsInDay;
                    // Виправити - 100 на 30
                    if(daysDifference > -100 && rows2[0]){
                        chosen_agre = item
                    }else{
                        return
                    }
                    }))
                if(chosen_agre){
                    let startAgree = new Date(chosen_agre.dateAgreeStart)
                    let startEnd = new Date(chosen_agre.dateAgreeEnd)
                    if(rating_data > startAgree && rating_data < startEnd){
                        let chosen_date = rating_data.getMonth() + 1
                        let [u_rati, f] : [any, any] = await (await conect).execute('SELECT * FROM users_rating WHERE user_id = ? AND appraiser = ? AND MONTH(data) = ?', [chosen_agre.subscriber_id, chosen_agre.owner_id, chosen_date])
                        if(u_rati[0]){
                            await (await conect).execute('UPDATE users_rating SET data = ?, mark = ?, about = ? WHERE user_id = ? AND appraiser = ? AND MONTH(data) = ?',
                            [rating_data, info.mark, info.about, chosen_agre.subscriber_id, chosen_agre.owner_id, chosen_date])
                            return true
                        }else{
                            await (await conect).execute('INSERT INTO users_rating (user_id, data, appraiser, mark, about) VALUES (?, ?, ?, ?, ?)',
                            [chosen_agre.subscriber_id, rating_data, chosen_agre.owner_id, info.mark, info.about])
                            return true
                        }
                    }else{
                        return "Ви не підпадаєте під дати договору"
                    }
                }else{
                    return "Підходящого договору не існує"
                }
            }else{
                return "Нажаль данну оцінку не змінити"
            }
        }else{
            return "Ви не можете виставити рейтинг даному користувачу"
        }
    }

    async getUserRating(user_id: string) {
        let [rows, fields]:[any, any] = await (await conect).execute('SELECT * FROM users_rating WHERE user_id = ?', [user_id])
        if (rows[0] !== undefined) {
            let ff = []
			await Promise.all(rows.map(async(i : any)=>{
				let [rows2, fields2] = await (await conect).execute('SELECT firstName, lastName, surName, img FROM users JOIN user_img ON users.user_id = user_img.user_id WHERE users.user_id = ?;', [i.appraiser])
				ff.push({info: i, reporter: rows2[0] })
				return 
			}))
          return ff
        } else {
          return false
        }
    }


    async getOwnerRating(user_id: string) {
        let [rows, fields] :[any, any] = await (await conect).execute('SELECT * FROM owner_rating WHERE user_id = ?', [user_id])
        if (rows[0] !== undefined) {
            let ff = []
			await Promise.all(rows.map(async(i : any)=>{
				let [rows2, fields2] = await (await conect).execute('SELECT firstName, lastName, surName, img FROM users JOIN user_img ON users.user_id = user_img.user_id WHERE users.user_id = ?;', [i.appraiser])
				ff.push({info: i, reporter: rows2[0] })
				return 
			}))
          return ff
        } else {
          return false
        }
    }



}