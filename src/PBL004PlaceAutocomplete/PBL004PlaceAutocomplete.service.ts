import { Client, PlaceAutocompleteRequest, PlaceAutocompleteResponse } from '@googlemaps/google-maps-services-js';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PBL004PlaceAutocompleteService {
	constructor(private configService: ConfigService) {}
	async doExecute(
		body: Omit<PlaceAutocompleteRequest['params'], 'key'>,
	): Promise<Pick<PlaceAutocompleteResponse, 'status' | 'data'>> {
		const client = new Client({});
		const { status, data } = await client
			.placeAutocomplete({
				params: {
					...body,
					key: this.configService.get<string>('GOOGLE_CLOUD_API_KEY')!,
				},
			})
			.then((value) => {
				return value;
			})
			.catch((e) => {
				console.log(e);
				return e.response;
			});
		return {
			status,
			data,
		};
	}
}
