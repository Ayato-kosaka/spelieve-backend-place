import { QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';

import { HowManyDaysToLimitPlaceUpserts } from 'spelieve-common/lib/Consts/Place';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';

export class PBL002UpsertPlaceDataServiceRule {
  constructor(private placeDocumentSnap: QueryDocumentSnapshot | null) {}

  public noNeedToUpsert(): boolean {
    return !this.isNeedToUpsert();
  }

  public needToInsert(): boolean {
    return !this.placeDocumentSnap;
  }

  public needToUpdate(): boolean {
    return !!this.placeDocumentSnap;
  }

  private isNeedToUpsert(): boolean {
    if (!this.placeDocumentSnap) {
      return true;
    }
    if (
      Timestamp.now().seconds -
        this.placeDocumentSnap.get(MPlace.Cols.updatedAt).seconds <
      HowManyDaysToLimitPlaceUpserts * 24 * 60 * 60
    ) {
      return false;
    }
    return true;
  }
}
