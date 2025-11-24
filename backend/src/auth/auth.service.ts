import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserRole, CompanyStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { company, user } = registerDto;

    // Verifica se o email já está cadastrado
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('Este email já está cadastrado no sistema');
    }

    // Verifica se o CNPJ já está cadastrado
    const existingCompany = await this.prisma.company.findUnique({
      where: { cnpj: company.cnpj },
    });

    if (existingCompany) {
      throw new ConflictException('Este CNPJ já está cadastrado no sistema');
    }

    // Criptografa a senha usando bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Cria a empresa e o usuário em uma transação
    // Se alguma operação falhar, tudo é revertido
    const newUser = await this.prisma.$transaction(async (prisma) => {
      // 1. Cria a empresa com status PENDING
      const createdCompany = await prisma.company.create({
        data: {
          cnpj: company.cnpj,
          fantasyName: company.fantasyName,
          socialReason: company.socialReason,
          zipCode: company.zipCode,
          address: company.address,
          number: company.number,
          complement: company.complement,
          neighborhood: company.neighborhood,
          city: company.city,
          state: company.state,
          phone: company.phone,
          status: CompanyStatus.PENDING, // Aguarda aprovação do admin
        },
      });

      // 2. Cria o usuário vinculado à empresa
      const createdUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: UserRole.SUPPLIER, // Sempre SUPPLIER no registro
          companyId: createdCompany.id,
        },
        include: {
          company: true, // Inclui dados da empresa na resposta
        },
      });

      return createdUser;
    });

    // Remove a senha da resposta por segurança
    const { password, ...userWithoutPassword } = newUser;
    
    return {
      message: 'Cadastro realizado com sucesso! Aguarde a aprovação do administrador.',
      user: userWithoutPassword,
    };
  }


  async login(loginDto: LoginDto) {
    const { email, password, role } = loginDto;

    // Busca o usuário pelo email e role
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        role, // Garante que o usuário tem o role solicitado
      },
      include: {
        company: true, // Inclui dados da empresa se houver
      },
    });

    // Valida se o usuário existe
    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // Valida a senha usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // Validações específicas para SUPPLIER
    if (role === UserRole.SUPPLIER) {
      // Verifica se o usuário tem uma empresa vinculada
      if (!user.company) {
        throw new BadRequestException('Usuário sem empresa vinculada');
      }

      // Verifica o status da empresa
      if (user.company.status === CompanyStatus.PENDING) {
        throw new BadRequestException(
          'Seu cadastro está em análise. Aguarde a aprovação do administrador.',
        );
      }

      if (user.company.status === CompanyStatus.REJECTED) {
        throw new BadRequestException(
          'Seu cadastro foi recusado. Entre em contato com o administrador.',
        );
      }
    }

    // Gera o token JWT
    const token = await this.generateToken(user);

    // Remove a senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'Login realizado com sucesso',
      access_token: token,
      user: userWithoutPassword,
    };
  }

  private async generateToken(user: any): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    return this.jwtService.signAsync(payload);
  }

  async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}