import { Module } from '@nestjs/common';

import { PBL003DirectionsController } from './PBL003Directions.controller';
import { PBL003DirectionsService } from './PBL003Directions.service';

@Module({
	controllers: [PBL003DirectionsController],
	providers: [PBL003DirectionsService],
})
export class PBL003DirectionsModule {}
