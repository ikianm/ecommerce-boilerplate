import { IsEnum } from "class-validator";
import { UserRole } from "../../common/enums/userRole.enum";


export class UpdateUserRoleDto {

    @IsEnum(UserRole)
    role: UserRole;

}