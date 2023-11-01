// import 'reflect-metadata';
// import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
// import { META_ROLES } from '../role-protected/role-protected.decorator';
// import { Auth } from './auth.decorator';

// const mockAuthGuard = jest.fn();
// const mockUserRoleGuard = jest.fn();

// jest.mock('@nestjs/passport', () => ({
//   AuthGuard: jest.fn().mockImplementation(() => mockAuthGuard),
// }));

// jest.mock('src/auth/guards/user-role/user-role.guard', () => ({
//   UserRoleGuard: jest.fn().mockImplementation(() => mockUserRoleGuard),
// }));

// describe('Auth Decorator', () => {
//   it('should apply RoleProtected and UseGuards with AuthGuard and UserRoleGuard', () => {
//     @Auth(ValidRoles.admin)
//     class TestClass {
//       testMethod() {}
//     }

//     // Verify RoleProtected metadata
//     const rolesMetadata = Reflect.getMetadata(META_ROLES, TestClass);
//     expect(rolesMetadata).toEqual([ValidRoles.admin]);

//     // Verifica los metadatos de UseGuards
//     const guards = Reflect.getMetadata('__guards__', TestClass);
//     expect(guards).toHaveLength(2);

//     // Utiliza la instancia de la función simulada para la verificación
//     expect(guards[0]).toBe(mockAuthGuard);
//     expect(guards[1]).toBe(mockUserRoleGuard);

//     // Verifica que las funciones simuladas hayan sido llamadas
//     expect(mockAuthGuard).toHaveBeenCalled();
//     expect(mockUserRoleGuard).toHaveBeenCalled();
//   });
// });
