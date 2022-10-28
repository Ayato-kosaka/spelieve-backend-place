import { Body, Controller, Post } from '@nestjs/common';

import { UpsertPlaceDataBodyInterface } from 'spelieve-common/lib/Interfaces';

import { PBL002UpsertPlaceDataService } from './PBL002UpsertPlaceData.service';

@Controller('PBL002')
export class PBL002UpsertPlaceDataController {
	constructor(private readonly service: PBL002UpsertPlaceDataService) {}

	// curl -XPOST -H "Content-Type:application/json" localhost:3000/PBL002 -d '{"place_id":"ChIJD4CMmg1cGGARaEcYbfRRgSk", "language":"ja"}'
	@Post()
	PBL002(@Body() PBL002Body: UpsertPlaceDataBodyInterface) {
		return this.service.doExecute(PBL002Body);
	}
}
