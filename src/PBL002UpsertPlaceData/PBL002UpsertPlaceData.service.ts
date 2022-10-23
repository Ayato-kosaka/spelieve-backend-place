import { firestore } from 'firebase-admin';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import Places, { GOOGLE_MAPS_API_TARGET } from 'google-places-web';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { GooglePlacePhotosMaxWidth, NumberOfImagesPlaceStores } from 'spelieve-common/lib/Consts/Place';
import { UpsertPlaceDataBodyInterface } from 'spelieve-common/lib/Interfaces';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';

import { PBL002UpsertPlaceDataServiceRule } from './PBL002UpsertPlaceData.rule';

@Injectable()
export class PBL002UpsertPlaceDataService {
	constructor(private readonly httpService: HttpService) {}

	async doExecute(body: UpsertPlaceDataBodyInterface) {
		// リクエストに合致する QueryDocumentSnapshot を取得する
		const placeCollectionRef = firestore().collection(MPlace.modelName);
		const placeDocumentSnap: QueryDocumentSnapshot | null = await placeCollectionRef
			.where(MPlace.Cols.place_id, '==', body.place_id)
			.where(MPlace.Cols.language, '==', body.language)
			.get()
			.then((qss) => (qss.empty ? null : qss.docs[0]));

		const rule = new PBL002UpsertPlaceDataServiceRule(placeDocumentSnap);

		// 一定時間の過ぎていないデータは更新しない
		if (rule.noNeedToUpsert()) {
			return "Don't need to upsert.";
		}

		// Google Place API を呼び出し、Place Details を取得する
		const googlePlaceDetailsResponse = await Places.details({
			placeid: body.place_id,
			language: body.language,
		});
		const googlePlaceDetailsResult = googlePlaceDetailsResponse.result;

		// Google Place Photo Urls を取得する
		const photoUrls: string[] = await Promise.all(
			googlePlaceDetailsResult.photos.slice(0, NumberOfImagesPlaceStores).map(async (photo) => {
				const photoAPIRes = await lastValueFrom(
					this.httpService.get(
						`${GOOGLE_MAPS_API_TARGET}/photo?maxwidth=${GooglePlacePhotosMaxWidth}&photoreference=${photo.photo_reference}&key=${Places.apiKey}`,
					),
				);
				return photoAPIRes.request.res.responseUrl as string;
			}),
		);

		// Google Place Details API のレスポンスを mPlace にセットする
		const mPlace: MPlace = {
			place_id: body.place_id,
			language: body.language,
			name: googlePlaceDetailsResult.name,
			imageUrl: googlePlaceDetailsResult.icon,
			geometry: {
				latitude: googlePlaceDetailsResult.geometry.location.lat,
				longitude: googlePlaceDetailsResult.geometry.location.lng,
			},
			mapUrl: googlePlaceDetailsResult.url,
			website: googlePlaceDetailsResult.website,
			formatted_address: googlePlaceDetailsResult.formatted_address,
			country: googlePlaceDetailsResult.address_components.find((address_component) =>
				address_component.types.includes('country'),
			)?.long_name as string,
			administrativeAreaLevel1: googlePlaceDetailsResult.address_components.find((address_component) =>
				address_component.types.includes('administrative_area_level_1'),
			)?.long_name,
			administrativeAreaLevel2: googlePlaceDetailsResult.address_components.find((address_component) =>
				address_component.types.includes('administrative_area_level_2'),
			)?.long_name,
			locality: googlePlaceDetailsResult.address_components.find((address_component) =>
				address_component.types.includes('locality'),
			)?.long_name,
			sublocalityLevel1: googlePlaceDetailsResult.address_components.find((address_component) =>
				address_component.types.includes('sublocality_level1'),
			)?.long_name,
			sublocalityLevel2: googlePlaceDetailsResult.address_components.find((address_component) =>
				address_component.types.includes('sublocality_level2'),
			)?.long_name,
			sublocalityLevel3: googlePlaceDetailsResult.address_components.find((address_component) =>
				address_component.types.includes('sublocality_level3'),
			)?.long_name,
			sublocalityLevel4: googlePlaceDetailsResult.address_components.find((address_component) =>
				address_component.types.includes('sublocality_level4'),
			)?.long_name,
			premise: googlePlaceDetailsResult.address_components.find((address_component) =>
				address_component.types.includes('premise'),
			)?.long_name,
			formatted_phone_number: googlePlaceDetailsResult.formatted_phone_number,
			openingHours: googlePlaceDetailsResult.opening_hours?.periods,
			rating: googlePlaceDetailsResult.rating,
			popularTags: [],
			photoUrls: photoUrls,
			createdAt: placeDocumentSnap ? placeDocumentSnap.get(MPlace.Cols.createdAt) : new Date(),
			updatedAt: new Date(),
		};

		// PDB01MPlace に登録を行う
		if (rule.needToInsert()) {
			await placeCollectionRef.add(mPlace);
		}

		// PDB01MPlace に更新を行う
		if (rule.needToUpdate()) {
			await placeDocumentSnap!.ref.set(mPlace);
		}

		return 'Success';
	}
}
