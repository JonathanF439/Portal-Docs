import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Carrega variáveis de ambiente do .env
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis disponíveis globalmente
    }),
    
    PrismaModule, // Conexão com banco de dados
    AuthModule,   // Autenticação e autorização
  ],
})
export class AppModule {}