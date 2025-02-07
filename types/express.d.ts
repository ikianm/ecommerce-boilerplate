import { UserRole } from "../src/common/enums/userRole.enum";

export { };
declare global {
    namespace Express {
        interface User {
            id: number,
            email: string,
            role: UserRole
        }
        interface Request {
            user?: User
        }
    }
}

//Instead of redefining user inside Request, we extend Express.User, which is what passport uses