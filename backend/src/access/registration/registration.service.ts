/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import * as mysql from 'mysql2';
import config from 'src/dbpar';
import sendMail from 'src/email';
import { Service } from '../service';
import conect2 from 'src/db_promise';
import * as crypto from "crypto"
import admin from 'src/firebaseConfig';

@Injectable()
export class RegistrationService {
  constructor(private readonly appService: AppService, private readonly Service: Service) { }


    async firstRegistration(inf: any, res: any): Promise<any> {
      const startDate :any = new Date(inf.dob);
      const endDate :any  = new Date()
      const timeDifference = endDate - startDate;
      const millisecondsInYear = 365.25 * 24 * 60 * 60 * 1000;
      const yearsDifference = timeDifference / millisecondsInYear;
      if(inf.regEmail !== undefined && inf.regEmail !== null && inf.regPassword !== undefined && inf.regPassword !== null && yearsDifference > 16){
        let a = await this.Service.registercheck(inf.regEmail)
        if(a){
          res.status(200).json({ status: "Ви вже зареєстровані"});
        }else{
          const password = inf.regPassword;
          const salt = '-vse23Discuss53213yt';
          const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
          inf.regPassword = hash.slice(0, 30);  
          let numb = await this.Service.new_secure(inf)
          const html = `<p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 16px;">Вас вітає служба безпеки</p>
          <h1 style="width: 400px; margin: 5px; text-align: center; font-size: 40px; font-weight: 600; color: rgba(0, 0, 0, 0.678);">Discussio</h1>
          <p style="width: 400px; margin: 5px; font-size: 20px; font-weight: 600; text-align: center; color: rgba(0, 0, 0, 0.678); ">Ваш код підтвердження: </p>
          <p  style="width: 400px; margin: 5px; border: 1px solid gray; text-align: center; border-radius: 20px; font-size: 40px; font-weight: 600; padding: 10px; color: #ff6347;">${numb}</p>
          <p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 12px;">Якщо ви не робили ніяких дій на сайті Discussio  проігноруйте це повідомлення</p>
          <p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 10px;">© Discussio. Developed by Discussio team.</p>
          `;
          await sendMail(html, inf.regEmail)
          res.status(200).json({ status: "На вашу пошту було надіслано код безпеки"});
        }
      }else{
          res.status(200).json({ status: "Ви не ввели почту або пароль"});
      }
    }

    async finalRegistration(inf: any, res: any): Promise<any> {
      if(inf.regEmail !== undefined && inf.regEmail !== null){
        let secure = await this.Service.secure(inf.regEmail)
        if(secure){
          let check = await this.Service.secure_check(inf.regEmail, inf.passCode)
          if(check.attempt_counter < 5){
            const conect = await conect2.getConnection();
            try{
                let [rows1, fields1] : [any, any] = await conect.execute ('INSERT INTO users (user_mail, password, dob, data_create) VALUES (?, ?, ?, ?)', [check.email, check.password, new Date(check.dob), new Date()])
                await this.Service.delete_secure(check.email)
                await conect.execute('INSERT INTO contacts (user_id) VALUES (?)', [rows1.insertId])
                await conect.execute('INSERT INTO user_img (user_id, img) VALUES (?, ?)', [rows1.insertId, "user_default.svg"])
                await conect.execute('INSERT INTO features (user_id) VALUES (?)', [rows1.insertId])
                await conect.execute('INSERT INTO user_parametrs (user_id) VALUES (?)', [rows1.insertId])
                await conect.execute('INSERT INTO user_status (user_id) VALUES (?)', [rows1.insertId])
                res.status(200).json({ status: true, email: inf.regEmail, password: check.password});
            }catch(err){
              res.status(200).json({ status: "Не правильно передані данні" })
            }finally{conect.release();}
          }else{
            await this.Service.updete_secure(check) 
            res.status(200).json({ status: "Не правильний код"});
          }
        }else{
          res.status(200).json({ status: false});
        }
      }else{
        res.status(200).json({ status: "Ви вже зареєстровані"});
      }
    }


    async forgotpass1(inf: any, res: any): Promise<any> {
        let a = await this.Service.registercheck(inf.email)
        if(a){
          let numb = await this.Service.new_secureforgotpass(inf)
          const html = `<p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 16px;">Вас вітає служба безпеки</p>
          <h1 style="width: 400px; margin: 5px; text-align: center; font-size: 40px; font-weight: 600; color: rgba(0, 0, 0, 0.678);">Discussio</h1>
          <p style="width: 400px; margin: 5px; font-size: 20px; font-weight: 600; text-align: center; color: rgba(0, 0, 0, 0.678); ">Ваш код підтвердження: </p>
          <p  style="width: 400px; margin: 5px; border: 1px solid gray; text-align: center; border-radius: 20px; font-size: 40px; font-weight: 600; padding: 10px; color: #ff6347;">${numb}</p>
          <p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 12px;">Якщо ви не робили ніяких дій на сайті Discussio  проігноруйте це повідомлення</p>
          <p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 10px;">© Discussio. Developed by Discussio team 2023.</p>
          `;
          await sendMail(html, inf.email)
          res.status(200).json({ status: "На вашу пошту було надіслано код безпеки"});
          
        }else{  
          res.status(200).json({ status: "Ви ще не зареєстровані"});
        }
    }



    async forgotpass2(inf: any, res: any): Promise<any> {
        
        let secure = await this.Service.secure(inf.email)
        if(secure){
          let check = await this.Service.secure_check(inf.email, inf.passCode)
          if(check.attempt_counter < 5){
            const conee = mysql.createConnection(config)
            try{
              const password = inf.password;
              const salt = '-vse23Discuss53213yt';
              const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
              inf.password = hash.slice(0, 30); 
              conee.query(
                'UPDATE users SET password = ? WHERE user_mail = ?;',
                // eslint-disable-next-line prettier/prettier
                [inf.password, check.email],
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                async (err, result:any) => {
                  // Додати до дениса
                  res.status(200).json({ status: true, email: check.email, password: inf.password});
                },
              );
            }catch(err){res.status(200).json({ status: "Не правильний код"});}finally{conee.end()} 
          }else{
            await this.Service.updete_secure(check) 
            res.status(200).json({ status: "Не правильний код"});
          }
        }else{
          res.status(200).json({ status: false});
        }
    }




    async googleLogin(inf: any, res: any): Promise<any> {
      const decodeValue = await admin.auth().verifyIdToken(inf.idToken)
      console.log(decodeValue.email)
      if(decodeValue.email == inf.email){
        let a = await this.Service.registercheck(inf.email)
        const pass = inf.idToken.slice(0, 30)
        const salt = '-vse23Discuss53213yt';
        const hash = crypto.createHash('sha256').update(pass + salt).digest('hex').slice(0, 30);;
        
        if(a){
          console.log(11)
          const conect = await conect2.getConnection();
          try{
            let [rows1, fields1] : [any, any] = await conect.execute ('UPDATE users SET password = ? WHERE user_mail = ?;', [hash, inf.email])
            res.status(200).json({ status: true, email: inf.email, password: hash});
          }catch(err){
            res.status(200).json({ status: "Не правильно передані данні" })
          }finally{conect.release();}
            
        }else{
          const conect = await conect2.getConnection();
          try{
            let [rows1, fields1] : [any, any] = await conect.execute ('INSERT INTO users (user_mail, password, data_create, dob) VALUES (?, ?, ?, ?)', [inf.email, hash, new Date(), new Date()])
            await conect.execute('INSERT INTO contacts (user_id) VALUES (?)', [rows1.insertId])
            await conect.execute('INSERT INTO user_img (user_id, img) VALUES (?, ?)', [rows1.insertId, "user_default.svg"])
            await conect.execute('INSERT INTO features (user_id) VALUES (?)', [rows1.insertId])
            await conect.execute('INSERT INTO user_parametrs (user_id) VALUES (?)', [rows1.insertId])
            await conect.execute('INSERT INTO user_status (user_id) VALUES (?)', [rows1.insertId])
            res.status(200).json({ status: true, email: inf.email, password: hash});
          }catch(err){
            console.log(err)
            res.status(200).json({ status: "Не правильно передані данні" })
          }finally{conect.release();}
        }
      }else{
        res.status(200).json({ status: "))))))))" })
      }

    }

    
}


