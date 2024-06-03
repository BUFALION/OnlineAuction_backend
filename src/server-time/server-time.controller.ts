import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ServerTimeDto } from './dto/server-time.dto';

@Controller('server-time')
@ApiTags('time')
export class ServerTimeController {

    @ApiOkResponse({
        type: ServerTimeDto
    })
    @Get()
    getTime() {
        return { serverTime: new Date() };
    }
}
