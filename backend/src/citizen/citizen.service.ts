/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import * as mysql from 'mysql2';
import config from 'src/dbpar';
import { AppService } from "src/app.service";
import { Service } from "./service";


@Injectable()
export class CitizenService {
  constructor(private readonly appService: AppService, private readonly Service: Service) {}

  async addAccess(tok: any, res: any): Promise<any> {
    //  Перевірити
    const a = await this.appService.authentification(tok.auth);
    if(a){
      const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
      if(fl){
        const citizen = await this.appService.citizen(tok.user_id, tok.flat_id);
        if(citizen){
          const agent_id = await this.appService.agent(tok.flat_id);
          if(agent_id === false || agent_id.user_id === tok.user_id){
            const conee = mysql.createConnection(config)
            try{
              conee.query(
                "UPDATE citizen SET acces_added = ?, acces_admin = ?, acces_services = ?, acces_comunal = ?, acces_filling = ?, acces_subs = ?, acces_discuss = ?, acces_agreement = ?, acces_citizen = ?, acces_comunal_indexes = ?, acces_agent = ?, acces_flat_features = ?, acces_flat_chats = ? WHERE flat_id = ? AND user_id = ?",
                [
                  tok.acces_added,
                  tok.acces_admin,
                  tok.acces_services,
                  tok.acces_comunal,
                  tok.acces_filling,
                  tok.acces_subs,
                  tok.acces_discuss,
                  tok.acces_agreement,
                  tok.acces_citizen,
                  tok.acces_comunal_indexes,
                  tok.acces_agent,
                  tok.acces_flat_features,
                  tok.acces_flat_chats,
                  tok.flat_id,
                  tok.user_id,
                ],
                (errrr, resu) => {
                  res.status(200).json({ status: ")" });
                }
              );
            }catch(err){res.status(200).json({ status: false });}finally{conee.end()}
          }else{
            const agent_id = await this.appService.agent(tok.flat_id);
            if(agent_id){
              const conee = mysql.createConnection(config)
              try{
                conee.query(
                  "UPDATE citizen SET acces_added = ?, acces_admin = ?, acces_services = ?, acces_comunal = ?, acces_filling = ?, acces_subs = ?, acces_discuss = ?, acces_agreement = ?, acces_citizen = ?, acces_comunal_indexes = ?, acces_flat_features = ?, acces_flat_chats = ? WHERE flat_id = ? AND user_id = ?",
                  [
                    tok.acces_added,
                    tok.acces_admin,
                    tok.acces_services,
                    tok.acces_comunal,
                    tok.acces_filling,
                    tok.acces_subs,
                    tok.acces_discuss,
                    tok.acces_agreement,
                    tok.acces_citizen,
                    tok.acces_comunal_indexes,
                    tok.acces_flat_features,
                    tok.acces_flat_chats,
                    tok.flat_id,
                    tok.user_id,
                  ],
                  (errrr, resu) => {
                    res.status(200).json({ status: ")" });
                  }
                );
              }catch(err){
                res.status(200).json({ status: false });
              }finally{conee.end()}

              
            }else{
              res.status(200).json({ status: false });
            }
          }
        }else{
          res.status(200).json({ status: false });
        }
      }else{
        const admin = await this.appService.citizen(a.user_id, tok.flat_id);
        if(admin.acces_added === 1 && admin.acces_admin === 1 && admin.acces_citizen === 1){
          const citizen = await this.appService.citizen(tok.user_id, tok.flat_id);
          if(citizen){
            const agent_id = await this.appService.agent(tok.flat_id);
            if(agent_id === false || agent_id.user_id === tok.user_id){
              const conee = mysql.createConnection(config)
              try{
                conee.query(
                  "UPDATE citizen SET acces_added = ?, acces_admin = ?, acces_services = ?, acces_comunal = ?, acces_filling = ?, acces_subs = ?, acces_discuss = ?, acces_agreement = ?, acces_citizen = ?, acces_comunal_indexes = ?, acces_agent = ?, acces_flat_features = ?, acces_flat_chats = ? WHERE flat_id = ? AND user_id = ?",
                  [
                    tok.acces_added,
                    tok.acces_admin,
                    tok.acces_services,
                    tok.acces_comunal,
                    tok.acces_filling,
                    tok.acces_subs,
                    tok.acces_discuss,
                    tok.acces_agreement,
                    tok.acces_citizen,
                    tok.acces_comunal_indexes,
                    tok.acces_agent,
                    tok.acces_flat_features,
                    tok.acces_flat_chats,
                    tok.flat_id,
                    tok.user_id,
                  ],
                  (errrr, resu) => {
                    res.status(200).json({ status: ")" });
                  }
                );
              }catch(err){res.status(200).json({ status: false });}finally{conee.end()}
            }else{
              const agent_id = await this.appService.agent(tok.flat_id);
              if(agent_id){
                const conee = mysql.createConnection(config)
                try{
                  conee.query(
                    "UPDATE citizen SET acces_added = ?, acces_admin = ?, acces_services = ?, acces_comunal = ?, acces_filling = ?, acces_subs = ?, acces_discuss = ?, acces_agreement = ?, acces_citizen = ?, acces_comunal_indexes = ?, acces_flat_features = ?, acces_flat_chats = ? WHERE flat_id = ? AND user_id = ?",
                    [
                      tok.acces_added,
                      tok.acces_admin,
                      tok.acces_services,
                      tok.acces_comunal,
                      tok.acces_filling,
                      tok.acces_subs,
                      tok.acces_discuss,
                      tok.acces_agreement,
                      tok.acces_citizen,
                      tok.acces_comunal_indexes,
                      tok.acces_flat_features,
                      tok.acces_flat_chats,
                      tok.flat_id,
                      tok.user_id,
                    ],
                    (errrr, resu) => {
                      res.status(200).json({ status: ")" });
                    }
                  );
                }catch(err){res.status(200).json({ status: false });}finally{conee.end()}

              }else{
                res.status(200).json({ status: false });
              }
            }
          }else{
            res.status(200).json({ status: false });
          }
        }else{
          if(admin.acces_services === 1 && admin.acces_comunal_indexes === 1 && admin.acces_added === 1 && admin.acces_citizen === 1){
            const citizen = await this.appService.citizen(tok.user_id, tok.flat_id);
            if(citizen){
              const conee = mysql.createConnection(config)
              try{
                conee.query(
                  "UPDATE citizen SET acces_services = ?, acces_comunal = ? WHERE flat_id = ? AND user_id = ?",
                  [tok.acces_services, tok.acces_comunal_indexes, admin.flat_id, citizen.user_id],
                  (errrr, resu) => {
                    res.status(200).json({ status: ")" });
                  }
                );
              }catch(err){res.status(200).json({ status: false });}finally{conee.end()}
            }else{
              res.status(200).json({ status: false });
            }
          }else{
            res.status(200).json({ status: false });
          }
        }
      }
    }else{
      res.status(200).json({ status: false });
    }
  }


  async agreeSit(tok: any, res: any): Promise<any> {
    //  Перевірити
    const a = await this.appService.authentification(tok.auth);
    if(a){
      const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
      if(fl){
        const citizen = await this.appService.citizen(tok.user_id, tok.flat_id);
        if(citizen === false){
          const agre = await this.Service.getUserSaveAgreement(tok.flat_id, tok.user_id);
          if(agre){
            const conee = mysql.createConnection(config)
            try{
              conee.query('INSERT INTO citizen (user_id, flat_id) VALUES (?, ?)', [agre.subscriber_id, fl.flat_id], (err, resul)=>{console.log(err)});
              conee.query('DELETE FROM accept_subs WHERE flat_id = ? AND user_id = ?;', [fl.flat_id, agre.user_id], (err, resul)=>{1});
              res.status(200).json({ status: true });
            }catch(err){res.status(200).json({ status: false });}finally{conee.end()}

          }else{
            res.status(200).json({ status: false });
          }
        }else{
          res.status(200).json({ status: false });
        }
      }else{
        const admin = await this.appService.citizen(a.user_id, tok.flat_id);
        if(admin.acces_citizen === 1 && admin.acces_agreement === 1){
          const citizen = await this.appService.citizen(tok.user_id, tok.flat_id);
          if(citizen === false){
            const agre = await this.Service.getUserSaveAgreement(tok.flat_id, tok.user_id);
            if(agre){
              const conee = mysql.createConnection(config)
              try{
                conee.query('INSERT INTO citizen (user_id, flat_id) VALUES (?, ?)', [agre.subscriber_id, admin.flat_id], (err, resul)=>{console.log(err)});
                conee.query('DELETE FROM accept_subs WHERE flat_id = ? AND user_id = ?;', [admin.flat_id, agre.user_id], (err, resul)=>{1});
                res.status(200).json({ status: true });
              }catch(err){res.status(200).json({ status: false });}finally{conee.end()}

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
      res.status(200).json({ status: false });
    }
  }


  async deleteCitizen(tok: any, res: any): Promise<any> {
    //  Перевірити
    const a = await this.appService.authentification(tok.auth);
    if(a){
      const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
      if(fl){
        const citizen = await this.appService.citizen(tok.user_id, fl.flat_id);
        const conee = mysql.createConnection(config)
        try{
          conee.query("DELETE FROM citizen WHERE flat_id = ? AND user_id = ?;", [
            fl.flat_id,
            citizen.user_id,
          ]);
          res.status(200).json({ status: true });
        }catch(err){
          res.status(200).json({ status: false });
        }finally{conee.end()}

      }else{
        const admin = await this.appService.citizen(a.user_id, tok.flat_id);
        if(admin.acces_admin === 1  && admin.acces_citizen === 1){
          const citizen = await this.appService.citizen(tok.user_id, admin.flat_id);
          const conee = mysql.createConnection(config)
          try{
            conee.query("DELETE FROM citizen WHERE flat_id = ? AND user_id = ?;", [
              admin.flat_id,
              citizen.user_id,
            ]);
            res.status(200).json({ status: true });
          }catch(err){
            res.status(200).json({ status: false });
          }finally{conee.end()}
        }else if(admin){
          const conee = mysql.createConnection(config)
          try{
            conee.query("DELETE FROM citizen WHERE flat_id = ? AND user_id = ?;", [
              admin.flat_id,
              a.user_id,
            ]);
          }catch(err){}finally{conee.end()}
        }
      }
    }else{
      res.status(200).json({ status: false });
    }
  }


  async getCitizen(tok: any, res: any): Promise<any> {
    //  Перевірити
    const a = await this.appService.authentification(tok.auth);
    if(a){
      const fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
      if(fl){
        const subsID: Array<any> | any = await this.Service.getIDCitizen(
          fl.flat_id,
          tok.offs
        );
        const cit = await Promise.all(
          subsID.map(async (e: any) => {
            return await this.Service.getCitizen(e.user_id, e.flat_id);
          })
        );
        res.status(200).json(cit);
      }else{
        const admin = await this.appService.citizen(a.user_id, tok.flat_id);
        if(admin.acces_admin === 1  && admin.acces_citizen === 1){
          const subsID: Array<any> | any = await this.Service.getIDCitizen(
            admin.flat_id,
            tok.offs
          );
          const cit = await Promise.all(
            subsID.map(async (e: any) => {
              return await this.Service.getCitizen(e.user_id, e.flat_id);
            })
          );
          res.status(200).json(cit);
        }else if(admin){
          const cit = await this.Service.getCitizen(a.user_id, admin.flat_id);
          res.status(200).json([cit]);
        }
      }
    }else{
      res.status(200).json({ status: false });
    }
  }

  async getCitizenFlats(tok: any, res: any): Promise<any> {
    const a = await this.appService.authentification(tok.auth);
    if (a) {
      const flIDSubs: Array<any> | any =
        await this.Service.getIDCitizenFlats(a.user_id, tok.offs);
        const flatSu = await Promise.all(
        flIDSubs.map(async (e: any) => {
          return await this.appService.getFlatforCitizen(e.flat_id);
        })
      );
      res.status(200).json(flatSu);
    } else {
      res.status(200).json({ status: false });
    }
  }


  async getCountCitizen(tok: any, res: any): Promise<any> {
    //  Перевірити
    let a = await this.appService.authentification(tok.auth)
    if(a){
      let fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
      if(fl){
        res.status(200).json({ status: await this.Service.countCitizen(tok.flat_id) });
      }else{
        let admin = await this.appService.citizen(a.user_id, tok.flat_id);
        if(admin.acces_citizen === 1){
          res.status(200).json({ status: await this.Service.countCitizen(tok.flat_id) });
        }else{
          res.status(200).json({ status: false });
        }
      }
    }else{
      res.status(200).json({ status: false });
    }
  }

  async getCountYCitizen(tok: any, res: any): Promise<any> {
    let a = await this.appService.authentification(tok.auth)
    if(a){
        res.status(200).json({ status: await this.Service.countYCitizen(a.user_id) });
    }else{
        res.status(200).json({ status: false });
    }
  }

}
