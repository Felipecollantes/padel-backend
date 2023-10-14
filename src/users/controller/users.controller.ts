import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { UsersService } from '../services/users.service';
import { CreateFriendshipDto } from '../dto/create-friendship.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Auth()
  @Post('friendship')
  createFriendship(@Body() createFriendshipDto: CreateFriendshipDto) {
    return this.usersService.createFriendship(createFriendshipDto);
  }

  @Auth()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Auth()
  @ApiParam({name: 'param'})
  @Get('user/:param')
  findOne(@Param('param') param: string) {
    return this.usersService.findOne(param);
  }

  @Auth()
  @ApiParam({name: 'param'})
  @Get(':param')
  findUsers(@Param('param') param: string) {
    return this.usersService.findUsers(param);
  }

  @Auth()
  @ApiParam({name: 'id'})
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Auth()
  @ApiParam({name: 'id'})
  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
