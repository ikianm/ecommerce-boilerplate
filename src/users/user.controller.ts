import { Controller } from "@nestjs/common";
import { UsersService } from "./services/user.service";


@Controller()
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ) { }

    

}