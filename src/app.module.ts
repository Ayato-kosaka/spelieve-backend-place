import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PBL002UpsertPlaceDataModule } from './PBL002UpsertPlaceData/PBL002UpsertPlaceData.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
		}),
		PBL002UpsertPlaceDataModule,
	],
})
export class AppModule {}
