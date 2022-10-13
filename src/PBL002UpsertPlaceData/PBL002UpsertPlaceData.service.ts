import { Injectable } from '@nestjs/common';
import {
  PBL002UpsertPlaceDataBodyInterface,
  PDB01MPlaceInterface,
} from 'spelieve-common/lib/Interface';
import { PDB01MPlaceNames } from 'spelieve-common/lib/Interface/Place/PDB01/MPlaceNames';
import { PDB01 } from 'spelieve-common/lib/Functions';
import { firestore } from 'firebase-admin';
import Places from 'google-places-web';
import {
  GeoPoint,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase-admin/firestore';

@Injectable()
export class PBL002UpsertPlaceDataService {
  async doExecute(body: PBL002UpsertPlaceDataBodyInterface) {
    // リクエストに該当する QueryDocumentSnapshot を取得する
    const collectionRef = firestore().collection(PDB01.name);
    const documentSnap: QueryDocumentSnapshot | null = await collectionRef
      .where(PDB01MPlaceNames.place_id, '==', body.place_id)
      .where(PDB01MPlaceNames.language, '==', body.language)
      .get()
      .then((qss) => (qss.empty ? null : qss.docs[0]));

    // 一定時間の過ぎていないデータは更新しない
    if (
      !documentSnap &&
      Timestamp.now().seconds -
        documentSnap.get(PDB01MPlaceNames.updatedAt).seconds <
        30 * 24 * 60 * 60
    ) {
      return "Don't need to upsert.";
    }

    // Google Place API を呼び出し、Place Details を取得する
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
      createdAt: documentSnap
        ? documentSnap.get(PDB01MPlaceNames.createdAt)
        : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // PDB01MPlace に upsert を行う
    if (!!documentSnap) {
      await collectionRef.add(googlePlaceDetail);
    } else {
      await documentSnap.ref.set(googlePlaceDetail);
    }

    return 'Success';
  }
}
