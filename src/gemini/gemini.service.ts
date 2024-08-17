import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, ResponseSchema } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
	constructor(
		private readonly configService: ConfigService
	) {}

	generateModel(responseSchema: ResponseSchema) {
		const genAI = new GoogleGenerativeAI(this.configService.get('GEMINI_API_KEY'));

		const model = genAI.getGenerativeModel({
			model: 'gemini-1.5-pro',
			generationConfig: {
				responseMimeType: 'application/json',
				responseSchema,
			}
		})

		return model;
	}
}
