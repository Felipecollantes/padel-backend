import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query, Delete } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { UsersService } from '../services/users.service';
import { CreateFriendshipDto } from '../dto/create-friendship.dto';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ApiTags, ApiParam, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register user',
    description: 'Register a new user',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Auth()
  @Post('friendship')
  @ApiOperation({
    summary: 'Create friendship',
    description: 'Establish a new friendship between users',
  })
  createFriendship(@Body() createFriendshipDto: CreateFriendshipDto) {
    return this.usersService.createFriendship(createFriendshipDto);
  }

  @Auth()
  @Get()
  @ApiOperation({
    summary: 'List users',
    description: 'Get a paginated list of users',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Auth()
  @Get('user/:param')
  @ApiOperation({
    summary: 'Get user by param (name or ID)',
    description: 'Retrieve a user by a specific parameter (name or ID)',
  })
  @ApiParam({ name: 'param', description: 'Specific user parameter to search' })
  findOne(@Param('param') param: string) {
    return this.usersService.findOne(param);
  }

  @Auth()
  @Get(':param')
  @ApiOperation({
    summary: 'Search users',
    description: 'Search users by a specific parameter',
  })
  @ApiParam({ name: 'param', description: 'Specific user parameter to search' })
  findUsers(@Param('param') param: string) {
    return this.usersService.findUsers(param);
  }

  @Auth()
  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update details of a specific user',
  })
  @ApiParam({ name: 'id', description: 'ID of the user to be updated' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Auth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Deactivate user',
    description: 'Deactivate a specific user from the system',
  })
  @ApiParam({ name: 'id', description: 'ID of the user to be deleted' })
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
