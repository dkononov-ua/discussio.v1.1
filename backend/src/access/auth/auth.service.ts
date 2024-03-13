import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';




@Injectable()
export class AuthService {
  constructor(private readonly appService: AppService) {}

  async getAuth(tok: any, res: any): Promise<any> {
    let a = await this.appService.login(tok)
    if(a){
      res.status(200).json({ status: true, email: a.email, password: a.password, you:"sweet", all_inf:a });
    }else{
      res.status(200).json({ status: false });
    }
  }

}
