import { Client, DirectionsRequest, DirectionsResponse } from '@googlemaps/google-maps-services-js';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PBL003DirectionsService {
	constructor(private configService: ConfigService) {}
	async doExecute(
		body: Omit<DirectionsRequest['params'], 'key'>,
	): Promise<Pick<DirectionsResponse, 'status' | 'data'>> {
		const client = new Client({});
		const { status, data } = await client.directions({
			params: { ...body, key: this.configService.get<string>('GOOGLE_CLOUD_API_KEY')! },
		});
		return {
			status,
			data,
		};
	}
}
