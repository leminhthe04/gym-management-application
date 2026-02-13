import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MembersService } from './members.service';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT) // 204
  @UseInterceptors(FileInterceptor('faceImage'))
  async registerMember(
    @Body('name') name: string,
    @Body('phone') phone: string,
    @UploadedFile() faceImage: Express.Multer.File,
  ) {
    console.log(phone, typeof phone);
    await this.membersService.registerMember(name, phone, faceImage);
  }
}
