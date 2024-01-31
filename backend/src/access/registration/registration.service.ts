/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import * as mysql from 'mysql2';
import config from 'src/dbpar';
import sendMail from 'src/email';
import { Service } from '../service';



@Injectable()
export class RegistrationService {
  constructor(private readonly appService: AppService, private readonly Service: Service) { }

    async getRegister(inf: any, res: any): Promise<any> {
      if(inf.regEmail.indexOf("@discussio.beta") != -1){
        const conee = mysql.createConnection(config)
        conee.query("SELECT COUNT(*) AS total FROM users",(er, re)=>{
          if(re[0].total <= 100){
            try{
              const startDate :any = new Date(inf.dob);
            const endDate :any  = new Date()
            const timeDifference = endDate - startDate;
            const millisecondsInYear = 365.25 * 24 * 60 * 60 * 1000;
            const yearsDifference = timeDifference / millisecondsInYear;
            if(inf.regEmail !== undefined && inf.regEmail !== null && inf.regPassword !== undefined && inf.regPassword !== null && yearsDifference >= 16){
              conee.query(
                'INSERT INTO users (firstName, user_mail, password, dob) VALUES (?, ?, ?, ?)',
                // eslint-disable-next-line prettier/prettier
                [inf.userName, inf.regEmail, inf.regPassword, startDate],
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (err, result:any) => {
                  // Додати до дениса
                if (err) {  
                  res.status(200).json({ status: "Не правильно передані данні" })
                }else{
                    conee.query('INSERT INTO contacts (user_id) VALUES (?)', [result.insertId])
                    conee.query('INSERT INTO user_img (user_id, img) VALUES (?, ?)', [result.insertId, "user_default.svg"])
                    conee.query('INSERT INTO features (user_id) VALUES (?)', [result.insertId])
                    conee.query('INSERT INTO user_parametrs (user_id) VALUES (?)', [result.insertId])
                    conee.query('INSERT INTO user_status (user_id) VALUES (?)', [result.insertId])
                  res.status(200).json({ status: true, email: inf.regEmail, password: inf.regPassword, userName: inf.userName});
                }
                conee.end()  
                },
              );}else{
                res.status(200).json({ status: "Не правильно передані данні"});
            }
            }catch(err){
              res.status(200).json({ status: "Не правильно передані данні"});
            }
          }else{
            res.status(200).json({ status: "Перевищенноо ліміт користувачів на платформі"});
          }
        })
      }else{
        res.status(200).json({ status: "Не правильний ключ-пошта"});
      }
    }



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
          let numb = await this.Service.new_secure(inf)
          const html = `<p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 16px;">Вас вітає служба безпеки</p>
          <h1 style="width: 400px; margin: 5px; text-align: center; font-size: 40px; font-weight: 600; color: rgba(0, 0, 0, 0.678);">Discussio</h1>
          <p style="width: 400px; margin: 5px; font-size: 20px; font-weight: 600; text-align: center; color: rgba(0, 0, 0, 0.678); ">Ваш код підтвердження: </p>
          <p  style="width: 400px; margin: 5px; border: 1px solid gray; text-align: center; border-radius: 20px; font-size: 40px; font-weight: 600; padding: 10px; color: #ff6347;">${numb}</p>
          <p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 12px;">Якщо ви не робили ніяких дій на сайті Discussio  проігноруйте це повідомлення</p>
          <p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 10px;">© Discussio. Developed by Discussio team 2023.</p>
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
            const conee = mysql.createConnection(config)
            conee.query(
              'INSERT INTO users (user_mail, password, dob, data_create) VALUES (?, ?, ?, ?)',
              // eslint-disable-next-line prettier/prettier
              [check.email, check.password, new Date(check.dob), new Date()],
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              async (err, result:any) => {
                // Додати до дениса
              if (err) {  
                res.status(200).json({ status: "Не правильно передані данні" })
              }else{
                await this.Service.delete_secure(check.email)
                conee.query('INSERT INTO contacts (user_id) VALUES (?)', [result.insertId])
                conee.query('INSERT INTO user_img (user_id, img) VALUES (?, ?)', [result.insertId, "user_default.svg"])
                conee.query('INSERT INTO features (user_id) VALUES (?)', [result.insertId])
                conee.query('INSERT INTO user_parametrs (user_id) VALUES (?)', [result.insertId])
                conee.query('INSERT INTO user_status (user_id) VALUES (?)', [result.insertId])
                res.status(200).json({ status: true, email: inf.regEmail, password: inf.regPassword});
              }
              conee.end()  
              },
            );
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
            conee.end()
          }else{
            await this.Service.updete_secure(check) 
            res.status(200).json({ status: "Не правильний код"});
          }
        }else{
          res.status(200).json({ status: false});
        }
    }

}
