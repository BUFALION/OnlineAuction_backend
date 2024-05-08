import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { TokenDto } from './dto/token.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { TokenService } from './token.service';

@Controller('token')
@ApiTags('tokens')
export class TokenController {

    constructor(private readonly tokenService: TokenService) {}

    @UseGuards(AuthGuard)
    @ApiProperty({
        type: [TokenDto]
    })
    @Get()
    findAllTokens(){
        return this.tokenService.findAllTokens()
    }
    

    @UseGuards(AuthGuard)
    @ApiProperty({
        type: TokenDto
    })
    @Post()
    async createToken(@Body() createTokenDto: CreateTokenDto) {
        return this.tokenService.createToken(createTokenDto)
    }
}
