import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PBL002UpsertPlaceDataController } from './PBL002UpsertPlaceData.controller';
import { PBL002UpsertPlaceDataService } from './PBL002UpsertPlaceData.service';

describe('PBL002UpsertPlaceDataController', () => {
	let controller: PBL002UpsertPlaceDataController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule],
			controllers: [PBL002UpsertPlaceDataController],
			providers: [PBL002UpsertPlaceDataService],
		}).compile();

		controller = module.get<PBL002UpsertPlaceDataController>(PBL002UpsertPlaceDataController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
