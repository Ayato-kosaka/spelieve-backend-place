import { Body, Controller, Post } from '@nestjs/common';
import { PBL002UpsertPlaceDataService } from './PBL002UpsertPlaceData.service';
import { PBL002UpsertPlaceDataBodyInterface } from 'spelieve-common/lib/Interface';

@Controller('PBL002')
export class PBL002UpsertPlaceDataController {
  constructor(private readonly service: PBL002UpsertPlaceDataService) {}

  // curl -XPOST -H "Content-Type:application/json" localhost:3000/PBL002 -d '{"place_id":"ChIJN1t_tDeuEmsRUsoyG83frY4", "language":"ja"}'
  @Post()
  PBL002(@Body() PBL002Body: PBL002UpsertPlaceDataBodyInterface) {
    return this.service.doExecute(PBL002Body);
  }
}
