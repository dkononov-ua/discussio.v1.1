/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AppService } from "src/app.service";
import { Service } from './service';

@Injectable()
export class ChatService {
  constructor(private readonly appService: AppService, private readonly Service: Service) {}

    async addChatFlat(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a){
          const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
          if(fl){
            if(await this.Service.getChat(fl.flat_id, tok.user_id) === false){ 
              if(await this.appService.getAgentFLS(tok.user_id)){
                res.status(200).json({ status: await this.Service.addChat(fl.flat_id, tok.user_id) });
              }else{
                res.status(200).json({ status: false });
              }
            }else{
              res.status(200).json({ status: "Чат вже існує" });
            }
          }else{
            const admin = await this.appService.citizen(a.user_id, tok.flat_id);
            if(admin.acces_flat_chats === 1){
              if(await this.Service.getChat(fl.flat_id, tok.user_id) === false){
                if(await this.appService.getAgentFLS(tok.user_id)){
                  res.status(200).json({ status: await this.Service.addChat(admin.flat_id, tok.user_id) });
                }else{
                  res.status(200).json({ status: false });
                }
              }else{
                res.status(200).json({ status: "Чат вже існує" });
              }
            }else{
              res.status(200).json({ status: "Немає доступу" });
            }
          }
        }else{
          res.status(200).json({ status: "Авторизуйтесь" });
        }
      }

      async addChatUser(tok: any, res: any): Promise<any> {
        //  Перевірити
        const a = await this.appService.authentification(tok.auth);
        if(a){
          const chat = await this.Service.getChat(tok.flat_id, a.user_id)
          if(chat === false){
            const fla = await this.appService.getFlatName(tok.flat_id)
            if(fla){
              res.status(200).json({ status: await this.Service.addChat(tok.flat_id, a.user_id) });
            }else{
              res.status(200).json({ status: false });
            }
          }else{
            res.status(200).json({ status: "Чат вже існує" });
          }
        }else{
          res.status(200).json({ status: "Авторизуйтесь" });
        }
      }


    
      async sendMessageFlat(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);

        if(a){
          const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
          if(fl){
            const chat = await this.Service.getChat(tok.flat_id, tok.user_id)
            if(chat){ 
              if(await this.appService.getAgentFLS(tok.user_id)){
                await this.Service.readMessageFlat(chat.user_id, chat.chat_id)
                res.status(200).json({ status: await this.Service.sendMessageFlat(a.user_id, fl.flat_id, chat.chat_id, tok.message) });
              }else{
                res.status(200).json({ status: false });
              }
            }else{
              res.status(200).json({ status: "Чат не існує" });
            }
          }else{
            const admin = await this.appService.citizen(a.user_id, tok.flat_id);
            if(admin.acces_flat_chats === 1){
              const chat = await this.Service.getChat(tok.flat_id, tok.user_id)
              if(chat){
                if(await this.appService.getAgentFLS(tok.user_id)){
                  await this.Service.readMessageFlat(chat.user_id, chat.chat_id)
                  res.status(200).json({ status: await this.Service.sendMessageFlat(a.user_id, admin.flat_id, chat.chat_id, tok.message) });
                }else{
                  res.status(200).json({ status: false });
                }
              }else{
                res.status(200).json({ status: "Чат не існує" });
              }
            }else{
              res.status(200).json({ status: "Немає доступу" });
            }
          }
        }else{
          res.status(200).json({ status: "Авторизуйтесь" });
        }
      }

      async sendMessageUser(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a){
          const chat = await this.Service.getChat(tok.flat_id, a.user_id)
          if(chat){
              await this.Service.readMessageUser(chat.flat_id, chat.chat_id)
              res.status(200).json({ status: await this.Service.sendMessageUser(a.user_id, chat.chat_id, tok.message) });
          }else{
            res.status(200).json({ status: "Чат не існує" });
          }
        }else{
          res.status(200).json({ status: "Авторизуйтесь" });
        }
      }
    
    async getmessageFlat(tok: any, res: any): Promise<any> {
      const a = await this.appService.authentification(tok.auth);
      if(a){
        const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
        if(fl){
          const chat = await this.Service.getChat(tok.flat_id, tok.user_id)
          if(chat){
            res.status(200).json({ status: await this.Service.getmessage(chat.chat_id, tok.offs) });
          }else{
            res.status(200).json({ status: false });
          }
        }else{
          const admin = await this.appService.citizen(a.user_id, tok.flat_id);
          if(admin.acces_flat_chats === 1){
            const chat = await this.Service.getChat(tok.flat_id, tok.user_id)
            if(chat){
              res.status(200).json({ status: await this.Service.getmessage(chat.chat_id, tok.offs) });
            }else{
              res.status(200).json({ status: false });
            }
          }else{
            res.status(200).json({ status: "Немає доступу" });
          }
        }
      }else{
        res.status(200).json({ status: "Авторизуйтесь" });
      }
    }

    async getmessageUser(tok: any, res: any): Promise<any> {
      const a = await this.appService.authentification(tok.auth);
      if(a){
        const chat = await this.Service.getChat(tok.flat_id, a.user_id)
        if(chat){
          res.status(200).json({ status: await this.Service.getmessage(chat.chat_id, tok.offs) });
        }else{
          res.status(200).json({ status: false });
        }
      }else{
        res.status(200).json({ status: "Авторизуйтесь" });
      }
    }


    async getChatsUser(tok: any, res: any): Promise<any> {
      const a = await this.appService.authentification(tok.auth);
      if (a) {
        res.status(200).json({ status: await this.Service.getChatsUser(a.user_id, tok.offs) });
      } else {
        res.status(200).json({ status: "Авторизуйтесь" });
      }
    }

    async getChatsFlat(tok: any, res: any): Promise<any> {
      const a = await this.appService.authentification(tok.auth);
      if(a){
        const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
        if(fl){
          res.status(200).json({ status: await this.Service.getChatsFlat(fl.flat_id, tok.offs) });
        }else{
          const admin = await this.appService.citizen(a.user_id, tok.flat_id);
          if(admin.acces_flat_chats === 1){
            res.status(200).json({ status: await this.Service.getChatsFlat(admin.flat_id, tok.offs) });
          }else{
            res.status(200).json({ status: "Немає доступу" });
          }
        }
      }else{
        res.status(200).json({ status: "Авторизуйтесь" });
      }
    }


    async readMessageFlat(tok: any, res: any): Promise<any> {
      const a = await this.appService.authentification(tok.auth);
        if(a){
          const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
          if(fl){
            const chat = await this.Service.getChat(fl.flat_id, tok.user_id)
            if(chat){ 
              if(await this.appService.getAgentFLS(tok.user_id)){
                res.status(200).json({ status: await this.Service.readMessageFlat(chat.user_id, chat.chat_id) });
              }else{
                res.status(200).json({ status: false });
              }
            }else{
              res.status(200).json({ status: false });
            }
          }else{
            const admin = await this.appService.citizen(a.user_id, tok.flat_id);
            if(admin.acces_flat_chats === 1){
              const chat = await this.Service.getChat(fl.flat_id, tok.user_id)
              if(chat){
                if(await this.appService.getAgentFLS(tok.user_id)){
                  res.status(200).json({ status: await this.Service.readMessageFlat(chat.user_id, chat.chat_id) });
                }else{
                  res.status(200).json({ status: false });
                }
              }else{
                res.status(200).json({ status: false });
              }
            }else{
              res.status(200).json({ status: false });
            }
          }
        }else{
          res.status(200).json({ status: "Авторизуйтесь" });
        }
    }

    async readMessageUser(tok: any, res: any): Promise<any> {
      const a = await this.appService.authentification(tok.auth);
      
      if(a){
        const chat = await this.Service.getChat(tok.flat_id, a.user_id)
        if(chat){
          res.status(200).json({ status: await this.Service.readMessageUser(chat.flat_id, chat.chat_id) });
        }else{
          res.status(200).json({ status: false });
        }
      }else{
        res.status(200).json({ status: "Авторизуйтесь" });
      }
    }


    async getNewMessageFlat(tok: any, res: any): Promise<any> {
      
      const a = await this.appService.authentification(tok.auth);
        if(a){
          const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
          if(fl){
            const chat = await this.Service.getChat(fl.flat_id, tok.user_id)
            if(chat){ 
              if(await this.appService.getAgentFLS(tok.user_id)){
                res.status(200).json({ status: await this.Service.getNewmessage(chat.chat_id, tok.data, tok.offs) });
              }else{
                res.status(200).json({ status: false });
              }
            }else{
              res.status(200).json({ status: false });
            }
          }else{
            const admin = await this.appService.citizen(a.user_id, tok.flat_id);
            if(admin.acces_flat_chats === 1){
              const chat = await this.Service.getChat(fl.flat_id, tok.user_id)
              if(chat){
                if(await this.appService.getAgentFLS(tok.user_id)){
                  res.status(200).json({ status: await this.Service.getNewmessage(chat.chat_id, tok.data, tok.offs) });
                }else{
                  res.status(200).json({ status: false });
                }
              }else{
                res.status(200).json({ status: false });
              }
            }else{
              res.status(200).json({ status: false });
            }
          }
        }else{
          res.status(200).json({ status: "Авторизуйтесь" });
        }
    }

    async getNewMessageUser(tok: any, res: any): Promise<any> {
      const a = await this.appService.authentification(tok.auth);
      if(a){
        const chat = await this.Service.getChat(tok.flat_id, a.user_id)
        if(chat){
          res.status(200).json({ status: await this.Service.getNewmessage(chat.chat_id, tok.data, tok.offs) });
        }else{
          res.status(200).json({ status: false });
        }
      }else{
        res.status(200).json({ status: "Авторизуйтесь" });
      }

    }

    async getDontReadMessageFlat(tok: any, res: any): Promise<any> {
      const a = await this.appService.authentification(tok.auth);
      if(a){
        const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
        if(fl){
          res.status(200).json({ status: await this.Service.dontReadMessageFlat(fl.flat_id) });
        }else{
          const admin = await this.appService.citizen(a.user_id, tok.flat_id);
          if(admin.acces_flat_chats === 1){
            res.status(200).json({ status: await this.Service.dontReadMessageFlat(admin.flat_id) });
          }else{
            res.status(200).json({ status: false });
          }
        }
      }else{
        res.status(200).json({ status: "Авторизуйтесь" });
      }
    }

    async getDontReadMessageUser(tok: any, res: any): Promise<any> {
      const a = await this.appService.authentification(tok.auth);
      if (a){
          res.status(200).json({ status: await this.Service.dontReadMessageUser(a.user_id) });
      } else {
        res.status(200).json({ status: "Авторизуйтесь" });
      }
    }

}
