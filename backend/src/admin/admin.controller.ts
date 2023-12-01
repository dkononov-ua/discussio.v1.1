import { Controller, Post, Response, Body } from '@nestjs/common';
import { AdminService } from './admin.service';



@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post("get/user")
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getUser(@Response() res, @Body() tok: Object): Promise<any> {
        await this.adminService.getUser(tok, res);
    }

    @Post("get/flat")
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getFlat(@Response() res, @Body() tok: Object): Promise<any> {
        await this.adminService.getFlat(tok, res);
    }


    @Post("get/users")
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getUsers(@Response() res, @Body() tok: Object): Promise<any> {
        await this.adminService.getUsers(tok, res);
    }

    @Post("get/flats")
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getFlats(@Response() res, @Body() tok: Object): Promise<any> {
        await this.adminService.getFlats(tok, res);
    }

    @Post("get/users/repots")
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getUsersReports(@Response() res, @Body() tok: Object): Promise<any> {
        await this.adminService.getUsersReports(tok, res);
    }

    @Post("get/flats/repots")
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getFlatsReports(@Response() res, @Body() tok: Object): Promise<any> {
        await this.adminService.getFlatsReports(tok, res);
    }

    @Post("change/user")
    // eslint-disable-next-line @typescript-eslint/ban-types
    async changeUser(@Response() res, @Body() tok: Object): Promise<any> {
        await this.adminService.changeUser(tok, res);
    }

    @Post("change/flat")
    // eslint-disable-next-line @typescript-eslint/ban-types
    async changeFlat(@Response() res, @Body() tok: Object): Promise<any> {
        await this.adminService.changeFlat(tok, res);
    }


    @Post("delete/users/report")
    // eslint-disable-next-line @typescript-eslint/ban-types
    async deleteUserReport(@Response() res, @Body() tok: Object): Promise<any> {
        await this.adminService.deleteUserReport(tok, res);
    }

    @Post("delete/flats/report")
    // eslint-disable-next-line @typescript-eslint/ban-types
    async deleteFlatReport(@Response() res, @Body() tok: Object): Promise<any> {
        await this.adminService.deleteFlatReport(tok, res);
    }



}
