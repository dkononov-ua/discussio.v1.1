import { Controller} from '@nestjs/common';
import { AppService } from './app.service';


@Controller('changeeeeeeeeeee')
export class AppController {
  constructor(private readonly appService: AppService) {}
}
