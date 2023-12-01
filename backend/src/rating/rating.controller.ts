import { Controller, Post, Response, Body } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('rating')
export class RatingController {
    constructor(private readonly RatingService: RatingService) {}

    @Post('add/userrating')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async addUserRating(@Response() res, @Body() tok: Object): Promise<any> {
        await this.RatingService.addUserRating(tok, res);
    }


    @Post('add/flatrating')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async addFlatRating(@Response() res, @Body() tok: Object): Promise<any> {
        await this.RatingService.addFlatRating(tok, res);
    }


    @Post('get/ownermarks')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getOwnerMarks(@Response() res, @Body() tok: Object): Promise<any> {
        await this.RatingService.getOwnerMarks(tok, res);
    }

    @Post('get/usermarks')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getUserMarks(@Response() res, @Body() tok: Object): Promise<any> {
        await this.RatingService.getUserMarks(tok, res);
    }

  

}
