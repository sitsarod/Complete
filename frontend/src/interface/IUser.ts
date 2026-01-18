import type { ReactNode } from "react";
import type { RoleInterface } from "./IRole";
import type { PositionInterface } from "./IPosition";
export interface UsersInterface {
    ID?: number;
    Username?: string;
    Password?: string;
    Email?: string;
    FirstName?: string;
    LastName?: string;
    Profile?: string;
    PhoneNumber?: string;
    Role?: RoleInterface
    Position?: PositionInterface
}

export interface SignupInput {
    FirstName: string;
    LastName: string;
    Email: string;
    Phone?: string;
    Password: string;
    Profile?: string;
    PositionID: number;
}