/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { Service } from './service';
import sendMail from 'src/email';



@Injectable()
export class UserinfoService {
  constructor(private readonly appService: AppService, private readonly Service: Service) {}

  async getUserinfoService(tok: any, res: any): Promise<any> {
    let a = await this.appService.authentification(tok)
    if(a){ 
      let img = await this.Service.getUserImg(a)
      if(img){
        let contacts = await this.Service.getContacts(a)
        let agree = await this.Service.countagree(a.user_id)
        let par = await this.appService.getUserParams(a.user_id)
        res.status(200).json({ status: true, inf: a, cont: contacts, img: img, agree: agree, parametrs: par})
      }else{
        let contacts = await this.Service.getContacts(a)
        let agree = await this.Service.countagree(a.user_id)
        let par = await this.appService.getUserParams(a.user_id)
        res.status(200).json({ status: true, inf: a, cont: contacts, img: "Фото не було знайдено", agree: agree, parametrs: par})
      }
    }
  }

  async getUserAgree(tok: any, res: any): Promise<any> {
    let a = await this.appService.authentification(tok)
    if(a){
      let agree = await this.Service.countagree(a.user_id) 
        res.status(200).json({ status: true, agree: agree})
    }
  }


  async getAgentinfo(tok: any, res: any): Promise<any> {
    const a = await this.appService.authentification(tok.auth);
    if(a){
      const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
      if(fl){
        const agent_id = await this.appService.agent(tok.flat_id);
        if(agent_id){
          let img = await this.Service.getUserImg(agent_id)
          if(img){
            let contacts = await this.Service.getContacts(agent_id)
            let ag = await this.appService.getAgentFLS(agent_id.user_id)
            res.status(200).json({ status: true, inf: ag, cont: contacts, img: img})
          }else{
            let contacts = await this.Service.getContacts(agent_id)
            let ag = await this.appService.getAgentFLS(agent_id.user_id)
            res.status(200).json({ status: true, inf: ag, cont: contacts, img: "Фото не було знайдено"})
          }
        }else{
          const owner = await this.appService.getFlatOwner(tok.flat_id);
          let img = await this.Service.getUserImg({user_id: owner.owner_id})
          if(img){
            let contacts = await this.Service.getContacts({user_id: owner.owner_id})
            let ag = await this.appService.getAgentFLS(owner.owner_id)
            res.status(200).json({ status: true, inf: ag, cont: contacts, img: img})
          }else{
            let contacts = await this.Service.getContacts({user_id: owner.owner_id})
            let ag = await this.appService.getAgentFLS(owner.owner_id)
            res.status(200).json({ status: true, inf: ag, cont: contacts, img: "Фото не було знайдено"})
          }
        }
      }else{
        const admin = await this.appService.citizen(a.user_id, tok.flat_id);
        if(admin.acces_agreement === 1 && admin.acces_added === 1){
          const agent_id = await this.appService.agent(tok.flat_id);
          if(agent_id){
            let img = await this.Service.getUserImg(agent_id)
            if(img){
              let contacts = await this.Service.getContacts(agent_id)
              let ag = await this.appService.getAgentFLS(agent_id.user_id)
              res.status(200).json({ status: true, inf: ag, cont: contacts, img: img})
            }else{
              let contacts = await this.Service.getContacts(agent_id)
              let ag = await this.appService.getAgentFLS(agent_id.user_id)
              res.status(200).json({ status: true, inf: ag, cont: contacts, img: "Фото не було знайдено"})
            }
          }else{
            const owner = await this.appService.getFlatOwner(tok.flat_id);
            let img = await this.Service.getUserImg({user_id: owner.owner_id})
            if(img){
              let contacts = await this.Service.getContacts({user_id: owner.owner_id})
              let ag = await this.appService.getAgentFLS(owner.owner_id)
              res.status(200).json({ status: true, inf: ag, cont: contacts, img: img})
            }else{
              let contacts = await this.Service.getContacts({user_id: owner.owner_id})
              let ag = await this.appService.getAgentFLS(owner.owner_id)
              res.status(200).json({ status: true, inf: ag, cont: contacts, img: "Фото не було знайдено"})
            }
          }
        }else{
          res.status(200).json({ status: false })
        }
      }
    }else{
      res.status(200).json({ status: false })
    }

}


async getUserinfoPublic(tok: any, res: any): Promise<any> {
  const a = await this.appService.authentification(tok.auth);
  if(a){   
    let img = await this.Service.getUserImg(tok)
    if(img){
      let ag = await this.appService.getAgentFLS(tok.user_id)
      res.status(200).json({inf: ag, img: img})
    }else{
      let ag = await this.appService.getAgentFLS(tok.user_id)
      res.status(200).json({ status: true, inf: ag, img: "Фото не було знайдено"})
    }
  }else{
    res.status(200).json({ status: false})
  }
}


async deleteUserFinal(tok: any, res: any): Promise<any> {
  const a = await this.appService.authentification(tok.auth);
  if(a){
    const b = await this.Service.secure_check(a.user_mail ,tok.code)
    if(b){
      await this.Service.deleteUser(a.user_id)
      res.status(200).json({ status: "Видалено"})
    }else{
      res.status(200).json({ status: "Невірний код"})
    }   
    
  }else{
    res.status(200).json({ status: false})
  }
}

async deleteUserFirst(tok: any, res: any): Promise<any> {
  const a = await this.appService.authentification(tok.auth);
    if(a){ 
      let numb = await this.Service.new_secure2(a.user_mail)
      const html = `<p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 16px;">Вас вітає служба безпеки</p>
      <h1 style="width: 400px; margin: 5px; text-align: center; font-size: 40px; font-weight: 600; color: rgba(0, 0, 0, 0.678);">Discussio</h1>
      <p style="width: 400px; margin: 5px; font-size: 20px; font-weight: 600; text-align: center; color: rgba(0, 0, 0, 0.678); ">Ваш код підтвердження: </p>
      <p  style="width: 400px; margin: 5px; border: 1px solid gray; text-align: center; border-radius: 20px; font-size: 40px; font-weight: 600; padding: 10px; color: #ff6347;">${numb}</p>
      <p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 12px;">Якщо ви не робили ніяких дій на сайті Discussio  проігноруйте це повідомлення</p>
      <p style="width: 400px; margin: 5px; color: gray; text-align: center; font-size: 10px;">© Discussio. Developed by Discussio team 2023.</p>
      `;
      await sendMail(html, a.user_mail)
      res.status(200).json({ status: "На вашу пошту було надіслано код безпеки"});
    }else{  
      res.status(200).json({ status: false});
    }
}


}
