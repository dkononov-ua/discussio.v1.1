import { Controller, Post, Response, Body, Get } from '@nestjs/common';
import { UserinfoService } from './userinfo.service';

@Controller('userinfo')
export class UserinfoController {
    constructor(private readonly userinfoService: UserinfoService) {}

    @Post()
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getUserinfo(@Response() res, @Body() tok: Object): Promise<any> {
      await this.userinfoService.getUserinfoService(tok, res);
    }

    @Post('agree')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getAgree(@Response() res, @Body() tok: Object): Promise<any> {
      await this.userinfoService.getUserAgree(tok, res);
    }


    @Post('agent')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getAgentinfo(@Response() res, @Body() tok: Object): Promise<any> {
      await this.userinfoService.getAgentinfo(tok, res);
    }

    @Post('public')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getUserinfoPublic(@Response() res, @Body() tok: Object): Promise<any> {
      await this.userinfoService.getUserinfoPublic(tok, res);
    }

    @Post('delete/first')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async deleteUserFisrst(@Response() res, @Body() tok: Object): Promise<any> {
      await this.userinfoService.deleteUserFirst(tok, res);
    }

    @Post('delete/finaly')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async deleteUserFinaly(@Response() res, @Body() tok: Object): Promise<any> {
      await this.userinfoService.deleteUserFinal(tok, res);
    }
}
