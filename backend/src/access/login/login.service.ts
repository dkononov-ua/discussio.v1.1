import { Injectable } from '@nestjs/common';
import conee from 'src/db';
import { AppService } from 'src/app.service';




@Injectable()
export class LoginService {
  asd: any;
  constructor(private readonly appService: AppService) {
    this.asd = 0;
  }


    async getLogin(tok: any, res: any): Promise<any> {

      if(this.asd === 0){
        this.asd = 1
        function CheckUsers():void {
          conee.query("SELECT COUNT(*) AS total FROM users", (err, resul)=>{
            console.log(resul)
            setTimeout(CheckUsers, 2 * 60 * 60 * 1000);
          })
        }
        CheckUsers()
      }else{}
      let a = await this.appService.authentification(tok)
      if(a){
        res.status(200).json({ status: true, email: a.user_mail, password: a.password, you:"sweet" });
      }else{
        res.status(200).json({ status: false });
      }
    }
}
