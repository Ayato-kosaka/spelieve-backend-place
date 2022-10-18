import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
import { HowManyDaysToLimitPlaceUpserts } from 'spelieve-common/lib/Consts/Place';
import { PBL002UpsertPlaceDataServiceRule } from './PBL002UpsertPlaceData.rule';

describe('PBL002UpsertPlaceDataServiceRule', () => {

  beforeEach(async () => {
  });

  it('noNeedToUpsert==TRUE_1', () => {
    const rule = new PBL002UpsertPlaceDataServiceRule(null);
    const spy =jest.spyOn((PBL002UpsertPlaceDataServiceRule as any).prototype, 'isNeedToUpsert').mockReturnValue(false);
    expect(rule.noNeedToUpsert()).toBe(true);
    spy.mockRestore()
  });

  it('isNeedToUpsert==TRUE_1', () => {
    const rule = new PBL002UpsertPlaceDataServiceRule(null);
    expect((rule as any).isNeedToUpsert()).toBe(true);
  });

  it('isNeedToUpsert==FALSE_1', () => {
    class placeDocumentSnap {
      public get() {
        return Timestamp.fromMillis(1000)
      }
    }
    const data = new placeDocumentSnap()
    const rule = new PBL002UpsertPlaceDataServiceRule(data as unknown as QueryDocumentSnapshot);
    const spy = jest.spyOn(Timestamp, 'now').mockReturnValue(Timestamp.fromMillis(HowManyDaysToLimitPlaceUpserts * 24 * 60 * 60 * 1000));
    expect((rule as any).isNeedToUpsert()).toBe(false);
    spy.mockRestore()
  });

  it('isNeedToUpsert==TRUE_2', () => {
    class placeDocumentSnap {
      public get() {
        return Timestamp.fromMillis(-1000)
      }
    }
    const data = new placeDocumentSnap()
    const rule = new PBL002UpsertPlaceDataServiceRule(data as unknown as QueryDocumentSnapshot);
    const spy = jest.spyOn(Timestamp, 'now').mockReturnValue(Timestamp.fromMillis(HowManyDaysToLimitPlaceUpserts * 24 * 60 * 60 * 1000));
    expect((rule as any).isNeedToUpsert()).toBe(true);
    spy.mockRestore()
  });
});
