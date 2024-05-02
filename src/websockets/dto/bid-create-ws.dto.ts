import { BidCreateDto } from "src/bid/dto/bid-create.dto"

export class BidCreateWsDto implements BidCreateDto{
    auctionId: number
    amount: number
}