import { Controller, Get, Response} from '@nestjs/common';
import { AppService } from './app.service';


@Controller('serv')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('chech')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getUsers(@Response() res): Promise<any> {
    res.status(200).json({ serb: true });
  }
}
