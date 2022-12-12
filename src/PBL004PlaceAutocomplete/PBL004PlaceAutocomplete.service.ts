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
		// const { isHideCities } = body;
		const { status, data } = await client
			.placeAutocomplete({
				params: {
					...body,
					key: this.configService.get<string>('GOOGLE_CLOUD_API_KEY')!,
					//   types: isHideCities ? 'establishment' : ['(cities)', 'establishment'], // TODO: 変換される場所の種類指定
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
