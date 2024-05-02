import { Test, TestingModule } from '@nestjs/testing';
import { BidGateway } from '../websockets/bid.gateway';

describe('BidGateway', () => {
  let gateway: BidGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BidGateway],
    }).compile();

    gateway = module.get<BidGateway>(BidGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
