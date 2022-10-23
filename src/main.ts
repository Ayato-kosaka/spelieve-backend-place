import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import Places from 'google-places-web';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService: ConfigService = app.get(ConfigService);

	Places.apiKey = configService.get<string>('GOOGLE_CLOUD_API_KEY');
	Places.debug = configService.get<string>('NODE_ENV') === 'development';

	const adminConfig: ServiceAccount = {
		projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
		privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
		clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
	};
	admin.initializeApp({
		credential: admin.credential.cert(adminConfig),
	});
	admin.firestore().settings({ ignoreUndefinedProperties: true });

	app.enableCors({
		origin: '*',
		allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
	});
	const port = Number(process.env.PORT) || 3000; // Cloud Run の要件。環境変数PORTで起動するように。
	await app.listen(port, '0.0.0.0'); // '0.0.0.0' を追加して外部からのアクセスを受け入れる。
}
bootstrap();
