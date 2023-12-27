import { Controller, Post, Response, Get, Body } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    @Post()
    async getLogin(@Response() res, @Body() tok:Object): Promise<any> {
      await this.loginService.getLogin( tok, res ); 
    }

    @Get('first')
    async getLoginFake(@Response() res, @Body() tok:Object): Promise<any> {
      await this.loginService.getLogin( {email:"asdafd", password:"de12awd2"}, res ); 
    }

}
