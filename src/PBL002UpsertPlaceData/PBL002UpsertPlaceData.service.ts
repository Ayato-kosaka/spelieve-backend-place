import { Injectable } from '@nestjs/common';
import {
  PBL002UpsertPlaceDataBodyInterface,
  PDB01MPlaceInterface,
  PDB02PlaceImagesInterface
} from 'spelieve-common/lib/Interface';
import { PDB01MPlaceNames } from 'spelieve-common/lib/Interface/Place/PDB01/MPlaceNames';
import { PDB01, PDB02 } from 'spelieve-common/lib/Functions';
import { firestore } from 'firebase-admin';
import Places, { GOOGLE_MAPS_API_TARGET } from 'google-places-web';
import {
  CollectionReference,
  GeoPoint,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase-admin/firestore';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class PBL002UpsertPlaceDataService {
  constructor(private readonly httpService: HttpService) {}

  async doExecute(body: PBL002UpsertPlaceDataBodyInterface) {
    // リクエストに該当する QueryDocumentSnapshot を取得する
    const placeCollectionRef = firestore().collection(PDB01.name);
    const placeDocumentSnap: QueryDocumentSnapshot | null = await placeCollectionRef
      .where(PDB01MPlaceNames.place_id, '==', body.place_id)
      .where(PDB01MPlaceNames.language, '==', body.language)
      .get()
      .then((qss) => (qss.empty ? null : qss.docs[0]));

    // 一定時間の過ぎていないデータは更新しない
    // if (
    //   !!placeDocumentSnap &&
    //   Timestamp.now().seconds -
    //     placeDocumentSnap.get(PDB01MPlaceNames.updatedAt).seconds <
    //     30 * 24 * 60 * 60
    // ) {
    //   return "Don't need to upsert.";
    // }

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
      geometry: new GeoPoint(
        googlePlaceDetailsResult.geometry.location.lat,
        googlePlaceDetailsResult.geometry.location.lng,
      ),
      mapUrl: googlePlaceDetailsResult.url,
      website: googlePlaceDetailsResult.website,
      address: googlePlaceDetailsResult.formatted_address,
      phoneNumber: googlePlaceDetailsResult.formatted_phone_number,
      openingHours: googlePlaceDetailsResult.opening_hours.periods,
      rating: googlePlaceDetailsResult.rating,
      popularTags: [],
      createdAt: placeDocumentSnap
        ? placeDocumentSnap.get(PDB01MPlaceNames.createdAt)
        : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };


    // PDB01MPlace に upsert を行う
    // placeImagesCollectionReference を取得する
    let placeImagesCollectionRef: CollectionReference;
    if (!!placeDocumentSnap) {
      await placeDocumentSnap.ref.set(googlePlaceDetail);
      placeImagesCollectionRef = firestore().collection(`${placeCollectionRef.path}/${placeDocumentSnap.id}/${PDB02.name}`)
    } else {
      const documentReference = await placeCollectionRef.add(googlePlaceDetail);
      placeImagesCollectionRef = firestore().collection(`${documentReference.path}/${PDB02.name}`)
    }
    

    // await googlePlaceDetailsResult.photos.slice(0, 9).forEach(async photo => {
    //   const photoAPIRes = await lastValueFrom(this.httpService.get(`${GOOGLE_MAPS_API_TARGET}/photo?maxwidth=${400}&photoreference=${photo.photo_reference}&key=${Places.apiKey}`))

    //   console.log(photoAPIRes.data.locations)
      // const data: PDB02PlaceImagesInterface = {
      //   imageUrl: photoAPIRes
      // }
      // placeImagesCollectionRef.add(data);
    // })


    return 'Success';
  }
}
