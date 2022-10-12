import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PBL002UpsertPlaceDataController } from './PBL002UpsertPlaceData/PBL002UpsertPlaceData.controller';
import { PBL002UpsertPlaceDataModule } from './PBL002UpsertPlaceData/PBL002UpsertPlaceData.module';

@Module({
  imports: [PBL002UpsertPlaceDataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
