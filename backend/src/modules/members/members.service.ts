import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class MembersService {
  constructor(
    private readonly prisma: PrismaService,
    // @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async registerMember(
    name: string,
    phone: string,
    faceImage: Express.Multer.File,
  ) {
    // 1. Check data
    // 1.1. Phone
    if (phone !== '') {
      if (!phone.match(/^0\d{9}$/)) {
        throw new BadRequestException('Invalid phone number format');
      }
      // Check duplicate phone number
      const existingMember = await this.prisma.member.findUnique({
        where: { phone },
      });

      if (existingMember) {
        throw new ConflictException(
          'Phone number already exists in another member',
        );
      }
    }

    console.log(faceImage);

    // 2. Call Python service to get faceImage vector
    const newFaceVector = Array(128).fill(0.3); // TODO
    const newFaveVectorString = JSON.stringify(newFaceVector);

    if (await this.checkFaceSimilarity(newFaveVectorString)) {
      console.log('Similar face already exists in another member');
      throw new ConflictException(
        'Similar face already exists in another member',
      );
    }

    // 3. Save member to DB
    try {
      const newId = randomUUID();
      await this.prisma
        .$executeRaw`INSERT INTO "Member" (id, name, phone, "faceVector", "updatedAt") VALUES 
            (${newId}, ${name}, ${phone === '' ? null : phone}, ${newFaveVectorString}::vector, NOW());`;
      console.log('insert ok');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
    }

    // return nothing if success
  }

  async checkFaceSimilarity(faceVectorString: string): Promise<boolean> {
    const THERESHOLD = 0.5;

    // 2. Check face vector similarity with existing members
    try {
      const similarMember = await this.prisma.$queryRaw<
        any[]
      >`SELECT "faceVector" <-> ${faceVectorString}::vector AS distance
                FROM "Member"
                ORDER BY distance ASC
                LIMIT 1;`;

      return (
        similarMember.length > 0 &&
        parseFloat(similarMember[0].distance) < THERESHOLD
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
