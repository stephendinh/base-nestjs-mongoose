import { EUserRoles } from '@database/schemas/types/roles.enum';
import { SetMetadata } from '@nestjs/common';

export const HasRoles = (...roles: EUserRoles[]) => SetMetadata('roles', roles);
