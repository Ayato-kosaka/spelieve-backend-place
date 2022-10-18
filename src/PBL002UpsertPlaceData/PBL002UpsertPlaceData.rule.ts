

import { HowManyDaysToLimitPlaceUpserts } from 'spelieve-common/lib/Consts/Place';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';

import { QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';

export class PBL002UpsertPlaceDataServiceRule {
  constructor(private placeDocumentSnap: QueryDocumentSnapshot | null) {}

  public noNeedToUpsert(): boolean {
    return !this.isNeedToUpsert();
  }

  public needToInsert(): boolean {
    if (this.placeDocumentSnap) {
      return false;
    } else {
      return true;
    }
  }

  public needToUpdate(): boolean {
    if (this.placeDocumentSnap) {
      return true;
    } else {
      return false;
    }
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
