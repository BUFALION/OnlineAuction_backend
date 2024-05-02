import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FavoriteService } from './favorite.service';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { FavoriteDto } from './dto/favorite.dto';

@Controller('favorite')
export class FavoriteController {

    constructor(private readonly favoriteService: FavoriteService){}

    @Get('')
    @ApiOkResponse({
        type: [FavoriteDto]
    })
    async findAll(): Promise<FavoriteDto[]>{
        return await this.favoriteService.findAll()
    }

    @UseGuards(AuthGuard)
    @Get('user')
    @ApiOkResponse({
        type: [FavoriteDto]
    })
    async findAllByUserId(@SessionInfo() session: GetSessionDto): Promise<FavoriteDto[]>{
        return await this.favoriteService.findAllByUserId(session.id)
    }
    @UseGuards(AuthGuard)
    @Get('auction/:auctionId') 
    async isAuctionFavorite(@Param('auctionId', ParseIntPipe) auctionId: number, @SessionInfo() sesssion: GetSessionDto){
        return await this.favoriteService.isAuctionFavorite(auctionId, sesssion.id)
    }

    @UseGuards(AuthGuard)
    @Post(':auctionId')
    @ApiCreatedResponse()
    async addFavorite(@Param('auctionId', ParseIntPipe) auctionId: number,@SessionInfo() session: GetSessionDto ){
        return this.favoriteService.create(session.id, auctionId)
    }

    @UseGuards(AuthGuard)
    @Delete(':auctionId')
    @ApiOkResponse({
        type: FavoriteDto
    })
    async deleteFvorite(@Param('auctionId', ParseIntPipe) auctionId: number,@SessionInfo() session: GetSessionDto): Promise<FavoriteDto>{
        return await this.favoriteService.delete(session.id, auctionId)
    }
}