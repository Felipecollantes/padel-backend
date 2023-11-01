import 'reflect-metadata';
import { RoleProtected, META_ROLES } from './role-protected.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

describe('RoleProtected', () => {
  it('should decorate class with expected roles metadata', () => {
    @RoleProtected(ValidRoles.admin, ValidRoles.user)
    class TestClass {}

    const rolesMetadata = Reflect.getMetadata(META_ROLES, TestClass);

    expect(rolesMetadata).toEqual([ValidRoles.admin, ValidRoles.user]);
  });
});
