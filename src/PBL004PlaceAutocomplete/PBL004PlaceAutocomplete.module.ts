import { Module } from '@nestjs/common';

import { PBL004PlaceAutocompleteController } from './PBL004PlaceAutocomplete.controller';
import { PBL004PlaceAutocompleteService } from './PBL004PlaceAutocomplete.service';

@Module({
	controllers: [PBL004PlaceAutocompleteController],
	providers: [PBL004PlaceAutocompleteService],
})
export class PBL004PlaceAutocompleteModule {}
