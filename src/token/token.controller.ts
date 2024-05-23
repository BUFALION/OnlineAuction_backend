import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { TokenDto } from './dto/token.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { TokenService } from './token.service';

@Controller('token')
@ApiTags('tokens')
export class TokenController {

    constructor(private readonly tokenService: TokenService) {}

    @ApiOkResponse({
        type: TokenDto
    })
    @Get(':token')
    async findTokenByUuid(@Param('token') token: string) {
        return this.tokenService.findTokenById(token)
    }

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
