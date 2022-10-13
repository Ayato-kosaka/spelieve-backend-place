import { Injectable } from '@nestjs/common';
import { PBL002UpsertPlaceDataBodyInterface } from 'spelieve-common/lib/Interface';
import { PDB01MPlaceInterface } from 'spelieve-common/lib/Interface/Place/PDB01';
import { PDB01 } from 'spelieve-common/lib/Functions';
import { firestore } from 'firebase-admin';
import Places from 'google-places-web';
import {
  GeoPoint,
  Timestamp,
} from 'firebase-admin/firestore';

@Injectable()
export class PBL002UpsertPlaceDataService {
  async doExecute(body: PBL002UpsertPlaceDataBodyInterface) {
    const documentSnapshot = await firestore()
      .collection(PDB01.name)
      .doc(body.place_id)
      .get();

    if (
      documentSnapshot.exists &&
      Timestamp.now().seconds - documentSnapshot.data().updatedAt.seconds <
        30 * 24 * 60 * 60
    ) {
      return "Don't need to upsert.";
    }

    const googlePlaceDetailsResponse = await Places.details({
      placeid: body.place_id,
      language: body.language,
    });
    const googlePlaceDetailsResult = googlePlaceDetailsResponse.result;
    const googlePlaceDetail: PDB01MPlaceInterface = {
      place_id: body.place_id,
      language: body.language,
      name: googlePlaceDetailsResult.name,
      imageUrl: googlePlaceDetailsResult.icon,
      // TODO あとで設定する
      instagramAPIID: '',
      geometry: new GeoPoint(
        googlePlaceDetailsResult.geometry.location.lat,
        googlePlaceDetailsResult.geometry.location.lng,
      ),
      // TODO あとで設定する
      geohash: '',
      mapUrl: googlePlaceDetailsResult.url,
      website: googlePlaceDetailsResult.website,
      address: googlePlaceDetailsResult.formatted_address,
      phoneNumber: googlePlaceDetailsResult.formatted_phone_number,
      openingHours: googlePlaceDetailsResult.opening_hours.periods,
      rating: googlePlaceDetailsResult.rating,
      popularTags: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await documentSnapshot.ref.set(googlePlaceDetail);
    return 'Success';
  }
}
