import { PlaceAutocompleteRequest } from '@googlemaps/google-maps-services-js';

import { Body, Controller, Post } from '@nestjs/common';

import { PBL004PlaceAutocompleteService } from './PBL004PlaceAutocomplete.service';

@Controller('PBL004')
export class PBL004PlaceAutocompleteController {
	constructor(private readonly service: PBL004PlaceAutocompleteService) {}

	// curl -XPOST -H "Content-Type:application/json" localhost:3080/PBL004 -d '{"input": "<place name>"}'
	@Post()
	PBL004(@Body() PBL004Body: Omit<PlaceAutocompleteRequest['params'], 'key'>) {
		return this.service.doExecute(PBL004Body);
	}
}
