import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { UserRole } from "../enums/userRole.enum";


@Injectable()
export class AdminGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean {
        const req: Request = context.switchToHttp().getRequest();
        return req.user?.role === UserRole.ADMIN;
    }

}