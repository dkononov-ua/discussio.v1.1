import { Controller, Post, Response, Body } from '@nestjs/common';
import { RegistrationService } from './registration.service';

@Controller('registration')
export class RegistrationController {

  constructor(private readonly regService: RegistrationService) {}

  // @Post()
  // // eslint-disable-next-line @typescript-eslint/ban-types
  // async getRegister(@Response() res, @Body() tok: Object): Promise<any> {
  //   await this.regService.getRegister(tok, res);
  // }

  @Post('first')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getFirstRegister(@Response() res, @Body() tok: Object): Promise<any> {
    await this.regService.firstRegistration(tok, res);
  }

  @Post('second')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async finalRegistration(@Response() res, @Body() tok: Object): Promise<any> {
    await this.regService.finalRegistration(tok, res);
  }

  @Post('forgotpass1')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async forgotpass1(@Response() res, @Body() tok: Object): Promise<any> {
    await this.regService.forgotpass1(tok, res);
  }

  @Post('forgotpass2')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async forgotpass2(@Response() res, @Body() tok: Object): Promise<any> {
    await this.regService.forgotpass2(tok, res);
  }


}
