import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Connection } from './connection.enum';
import { SubscribeToAuctionWsDto } from './dto/subscribe-to-auction-ws.dto';
import { Logger, UseGuards } from '@nestjs/common';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { AuthGuardWs } from 'src/auth/guard/socket.guard';
import { SessionInfoWs } from 'src/auth/session-info.decorator';
import { BidService } from 'src/bid/bid.service';
import { BidCreateWsDto } from './dto/bid-create-ws.dto';
import { BidCreateResponseWsDto } from './dto/bid-create-response-ws.dto';
import { AuctionService } from 'src/auction/auction.service';
import { NotificationService } from 'src/notification/notification.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BidDto } from 'src/bid/dto/bid.dto';
import { Auction, NotificationInfo } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class BidGateway implements OnGatewayInit {
  private readonly logger = new Logger(BidGateway.name);

  @WebSocketServer() server: Server = new Server();

  constructor(
    private readonly bidService: BidService,
    private readonly auctionService: AuctionService,
    private readonly notificationService: NotificationService,
    private eventEmitter: EventEmitter2,
  ) {}

  afterInit() {
    this.logger.log('Initialized');
    this.listenEvent();
  }

  @UseGuards(AuthGuardWs)
  @SubscribeMessage(Connection.subscribeToAuction)
  async subscribeToAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() subscribeToAuctionDto: SubscribeToAuctionWsDto,
    @SessionInfoWs() session: GetSessionDto,
  ) {
    client.join(subscribeToAuctionDto.auctionId);

    const result: BidCreateResponseWsDto = {
      currentBid: await this.bidService.getMaxBidByAuction(
        parseInt(subscribeToAuctionDto.auctionId),
      ),
      countBids: await this.bidService.getCountBidsByAuction(
        parseInt(subscribeToAuctionDto.auctionId),
      ),
    };
    this.server
      .to(subscribeToAuctionDto.auctionId)
      .emit(Connection.auctionUpdate, result);
  }

  @UseGuards(AuthGuardWs)
  @SubscribeMessage(Connection.newBid)
  async newBid(
    @ConnectedSocket() client: Socket,
    @MessageBody() bidCreateWsDto: BidCreateWsDto,
    @SessionInfoWs() session: GetSessionDto,
  ) {

    if (!client.rooms.has(bidCreateWsDto.auctionId.toString())) {
      return client.emit('auctionError', {
        error: 'Необходимо сначала подписаться на аукцион',
      });
    }

    if (await this.auctionService.checkAuctionExpiration(bidCreateWsDto.auctionId) === true){
      return client.emit('auctionError', { error: 'Аукцион уже закончился' });
    }

     

    const lastBid = await this.bidService.getLastHighestBid(
      bidCreateWsDto.auctionId,
    );

    if (lastBid && lastBid.userId !== session.id) {

      const notification = await this.notificationService.create(
        {
          title: `Ваша ставка на аукцион перебита ${lastBid.auctionId}`,
          description: `Новая ставка: ${bidCreateWsDto.amount}`,
          statusInfo: NotificationInfo.WARNING
        },
        lastBid.userId,
      );
    }

    const bid = await this.bidService.placeBid(
      bidCreateWsDto,
      bidCreateWsDto.auctionId,
      session.id,
    );

    
    // await this.emitAuctionUpdate(bidCreateWsDto.auctionId);
  }

  private listenEvent() {
    this.eventEmitter.on('bid.updated',(data: BidDto) => this.emitAuctionUpdate(data))
    this.eventEmitter.on('auction.start', (auction: Auction) => this.emitAuctionStart(auction))
    this.eventEmitter.on('auction.end', (auction: Auction) => this.emitAuctionEnd(auction))
    this.eventEmitter.on('auction.cancel', (auction: Auction) => this.emitAuctionCancel(auction))
  }

  private emitAuctionStart = (auction: Auction) => this.server.to(auction.id.toString()).emit(Connection.auctionStart);
  private emitAuctionEnd = (auction: Auction) => this.server.to(auction.id.toString()).emit(Connection.auctionEnd);
  private emitAuctionCancel = (auction: Auction) => this.server.to(auction.id.toString()).emit(Connection.auctionCancel);


  private async emitAuctionUpdate(bid: BidDto) {
    const result: BidCreateResponseWsDto = {
      currentBid: await this.bidService.getMaxBidByAuction(bid.auctionId),
      countBids: await this.bidService.getCountBidsByAuction(bid.auctionId),
    };
    this.server.to(bid.auctionId.toString()).emit(Connection.auctionUpdate, result);
  }
}
