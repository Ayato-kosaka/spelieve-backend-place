import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PBL002UpsertPlaceDataModule } from './PBL002UpsertPlaceData/PBL002UpsertPlaceData.module';
import { PBL003DirectionsModule } from './PBL003Directions/PBL003Directions.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
		}),
		PBL002UpsertPlaceDataModule,
		PBL003DirectionsModule,
	],
})
export class AppModule {}
