import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 hace PrismaService global
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
