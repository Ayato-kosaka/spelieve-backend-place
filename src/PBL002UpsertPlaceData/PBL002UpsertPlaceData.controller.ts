import { Controller } from '@nestjs/common';
import { PBL002UpsertPlaceDataService } from './PBL002UpsertPlaceData.service';

@Controller('pbl002-upsert-place-data')
export class PBL002UpsertPlaceDataController {
  constructor(private readonly PBL002UpsertPlaceDataService: PBL002UpsertPlaceDataService) {}
}
