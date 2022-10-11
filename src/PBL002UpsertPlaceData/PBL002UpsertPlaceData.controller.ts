import { Body, Controller, Post } from '@nestjs/common';
import { PBL002UpsertPlaceDataService } from './PBL002UpsertPlaceData.service';
import { PCF002UpsertPlaceDataRequestInterface } from 'spelieve-common/Interface'

@Controller('PBL002UpsertPlaceData')
export class PBL002UpsertPlaceDataController {
  constructor(private readonly PBL002UpsertPlaceDataService: PBL002UpsertPlaceDataService) {}

  @Post()
  PBL002(@Body() PBL002Body: PCF002UpsertPlaceDataRequestInterface) {
    return this.PBL002UpsertPlaceDataService.doExecute(PBL002Body);
  }
}
