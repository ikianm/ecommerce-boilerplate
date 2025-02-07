import { UserRole } from "../../common/enums/userRole.enum";

export default interface IJwtPayload {
    id: string;
    email: string;
    role: UserRole;
}