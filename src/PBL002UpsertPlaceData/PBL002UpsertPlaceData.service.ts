import { Injectable } from '@nestjs/common';
import { PBL002UpsertPlaceDataBodyInterface } from 'spelieve-common/Interface/Place/PBL002/UpsertPlaceDataBodyInterface';
import { PDB01MPlaceInterface } from 'spelieve-common/Interface/Place/PDB01/MPlaceInterface';
import * as admin from 'firebase-admin';
import Places from 'google-places-web';
import { GeoPoint, Timestamp } from '@firebase/firestore-types';
import { PDB01 } from 'spelieve-common/Interface';

@Injectable()
export class PBL002UpsertPlaceDataService {
  async doExecute(body: PBL002UpsertPlaceDataBodyInterface) {
    const documentReference = admin
      .firestore()
      .collection(PDB01.name)
      .doc(body.place_id);
    const documentSnapshot = await documentReference.get();
    const fetchGooglePlaceDetail = async (): Promise<PDB01MPlaceInterface> => {
      const googlePlaceDetailsResponse = await Places.details({
        placeid: body.place_id,
        language: body.language,
      });
      const googlePlaceDetailsResult = googlePlaceDetailsResponse.result;
      return {
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
    };
    if (
      documentSnapshot.exists &&
      Timestamp.now().seconds -
        documentSnapshot.data().updatedAt.seconds <
        30 * 24 * 60 * 60
    ) {
      return 'Nothig to upsert.';
    }
    await documentReference.set(fetchGooglePlaceDetail());
    return 'Success';
  }
}
