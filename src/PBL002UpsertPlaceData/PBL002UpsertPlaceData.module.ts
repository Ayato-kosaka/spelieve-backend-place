import { Module } from '@nestjs/common';
import { PBL002UpsertPlaceDataService } from './PBL002UpsertPlaceData.service';
import { PBL002UpsertPlaceDataController } from './PBL002UpsertPlaceData.controller';

@Module({
  controllers: [PBL002UpsertPlaceDataController],
  providers: [PBL002UpsertPlaceDataService]
})
export class PBL002UpsertPlaceDataModule {}
