import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { PBL002UpsertPlaceDataController } from './PBL002UpsertPlaceData.controller';
import { PBL002UpsertPlaceDataService } from './PBL002UpsertPlaceData.service';

@Module({
  imports: [HttpModule],
  controllers: [PBL002UpsertPlaceDataController],
  providers: [PBL002UpsertPlaceDataService],
})
export class PBL002UpsertPlaceDataModule {}
