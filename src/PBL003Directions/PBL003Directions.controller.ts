import { DirectionsRequest } from '@googlemaps/google-maps-services-js';

import { Body, Controller, Post } from '@nestjs/common';

import { PBL003DirectionsService } from './PBL003Directions.service';

@Controller('PBL003')
export class PBL003DirectionsController {
	constructor(private readonly service: PBL003DirectionsService) {}

	// curl -XPOST -H "Content-Type:application/json" localhost:3080/PBL003 -d '{"place_id":"ChIJD4CMmg1cGGARaEcYbfRRgSk", "language":"ja"}'
	@Post()
	PBL003(@Body() PBL003Body: Omit<DirectionsRequest['params'], 'key'>) {
		return this.service.doExecute(PBL003Body);
	}
}
