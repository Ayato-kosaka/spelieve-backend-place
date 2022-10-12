import { Body, Controller, Post } from '@nestjs/common';
import { PBL002UpsertPlaceDataService } from './PBL002UpsertPlaceData.service';
import { PBL002UpsertPlaceDataBodyInterface } from 'spelieve-common/lib/Interface';

@Controller('PBL002')
export class PBL002UpsertPlaceDataController {
  constructor(private readonly service: PBL002UpsertPlaceDataService) {}

  @Post()
  PBL002(@Body() PBL002Body: PBL002UpsertPlaceDataBodyInterface) {
    return this.service.doExecute(PBL002Body);
  }
}
