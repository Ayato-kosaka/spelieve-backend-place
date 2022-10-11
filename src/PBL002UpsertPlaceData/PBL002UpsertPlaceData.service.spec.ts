import { Test, TestingModule } from '@nestjs/testing';
import { PBL002UpsertPlaceDataService } from './PBL002UpsertPlaceData.service';

describe('PBL002UpsertPlaceDataService', () => {
  let service: PBL002UpsertPlaceDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PBL002UpsertPlaceDataService],
    }).compile();

    service = module.get<PBL002UpsertPlaceDataService>(PBL002UpsertPlaceDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
