import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import * as crypto from "crypto"



@Injectable()
export class LoginService {
  constructor(private readonly appService: AppService) {}


    async getLogin(tok: any, res: any): Promise<any> {
      const password = tok.password;
      const salt = '-vse23Discuss53213yt';
      const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
      tok.password = hash.slice(0, 30);
      let a = await this.appService.login(tok)
      if(a){
        res.status(200).json({ status: true, email: a.user_mail, password: a.password, you:"sweet", all_inf:a });
      }else{
        res.status(200).json({ status: false });
      }
    }
}
