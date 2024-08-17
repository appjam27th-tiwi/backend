import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { SchemaType } from '@google/generative-ai';

const NameType =  {
	type: SchemaType.STRING,
	example: [
		'선린인터넷고등학교',
		'경복궁',
		'종로 3가 맛집 거리',
		'청계천',
		'명동 거리',
		'남산서울타워'
	]
}

const AddressType = {

	type: SchemaType.OBJECT,
	properties: {
		lat: {
			type: SchemaType.NUMBER,
			example: [
				37.5599,
				37.5759,
				37.5729,
				37.5692,
				37.5602,
				37.5512
			]
		},
		lng: {
			type: SchemaType.NUMBER,
			example: [
				126.9439,
				126.9768,
				126.9847,
				126.9787,
				126.9860,
				126.9882
			]
		}
	}
}

@Controller('gemini')
export class GeminiController {
	constructor(
		private readonly geminiService: GeminiService
	) {
	}

	@Get('/')
	async getCookieRecipe(
		@Query('location') location: string = '',
		@Query('day') day: number,
		@Query('sleepDay') sleepDay: number
	) {
		try {
			const model = this.geminiService.generateModel({
				type: SchemaType.OBJECT,
				properties: {
					hotel: {
						type: SchemaType.OBJECT,
						properties: {
							name: NameType,
							address: AddressType
						}
					},
					course: {
						type: SchemaType.ARRAY,
						items: {
							type: SchemaType.ARRAY,
							items: {
								type: SchemaType.OBJECT,
								properties: {
									name: NameType,
									address: AddressType,
									time: {
										type: SchemaType.OBJECT,
										properties: {
											start: {
												type: SchemaType.STRING,
												example: [
													'09:00',
													'10:00',
													'11:00',
												]
											},
											end: {
												type: SchemaType.STRING,
												example: [
													'10:00',
													'11:00',
													'12:00',
												]
											}
										},
										required: [ 'start', 'end' ]
									},
									type: {
										type: SchemaType.STRING,
										enum: [
											'sightseeing',
											'food',
											'shopping',
										]
									}
								},
								required: [ 'name', 'address', 'time', 'type' ]
							}
						}
					},
					message: {
						type: SchemaType.STRING,
						example: '여행 코스: 부산 양정동 코스\n' +
							'여행 기간은 1일이야\n' +
							'< 코스 >\n' +
							'부산역 → 양정동 (지하철 이동)\n' +
							'부산역→ 양정역(부산지하철 1호선)\n' +
							'소요 시간: 약 30분\n' +
							'\n' +
							'양정동 내 이동 (도보 또는 지역 버스)\n' +
							'(1) 양정동 중앙시장(화장실 O)\n' +
							'고고횟집(1인 가성비 횟집)\n' +
							'\n' +
							'(2) 양정동 카페 거리(화장실 O)\n' +
							'카페 세컨드플로어\n' +
							'카페 에이치\n' +
							'\n' +
							'(3) 부산 동래 온천(화장실 O)\n' +
							'동래온천호텔\n' +
							'\n' +
							'총 경비: 약 50,000원'
					}
				},
				required: [ 'hotel', 'course', 'message' ]
			});

			const prompt = `
			I am planning a trip to ${ location }. Please create a detailed itinerary based on the following strict requirements:
			1. Recommend only real hotels, tourist attractions, and restaurants that are actually located in or near ${ location }.
			2. Recommend exactly one hotel near ${ location } and list it first in the itinerary.
			3. Provide accurate latitude and longitude coordinates for every place, ensuring they match the actual locations.
			4. The itinerary should cover ${ day } days and include ${ day } separate courses, with no overlap in times.
			5. Do not recommend food places consecutively, and avoid revisiting any locations from previous days.
			6. All times must be non-overlapping and logically sequenced.
			7. Summarize the total course and message it like the example. 
			8. Ensure that the response is provided in Korean.

			Be as accurate and detailed as possible, adhering to these requirements to avoid any mistakes.
		`;


			const data = await model.generateContent(prompt);

			// Return response in Korean
			return JSON.parse(data.response.text());
		} catch (error) {
			return {
				error: {
					message: error.message
				}
			}
		}
	}

	@Post('/fix')
	async fix(@Body() body: any){
		const model = this.geminiService.generateModel({
			type: SchemaType.OBJECT,
			properties: {
				hotel: {
					type: SchemaType.OBJECT,
					properties: {
						name: NameType,
						address: AddressType
					}
				},
				course: {
					type: SchemaType.ARRAY,
					items: {
						type: SchemaType.ARRAY,
						items: {
							type: SchemaType.OBJECT,
							properties: {
								name: NameType,
								address: AddressType,
								time: {
									type: SchemaType.OBJECT,
									properties: {
										start: {
											type: SchemaType.STRING,
											example: [
												'09:00',
												'10:00',
												'11:00',
											]
										},
										end: {
											type: SchemaType.STRING,
											example: [
												'10:00',
												'11:00',
												'12:00',
											]
										}
									},
									required: ['start', 'end']
								},
								type: {
									type: SchemaType.STRING,
									enum: [
										'sightseeing',
										'food',
										'shopping',
									]
								}
							},
							required: ['name', 'address', 'time', 'type']
						}
					}
				},
				message: {
					type: SchemaType.STRING,
					example: '여행 코스: 부산 양정동 코스\n' +
						'여행 기간은 1일이야\n' +
						'< 코스 >\n' +
						'부산역 → 양정동 (지하철 이동)\n' +
						'부산역→ 양정역(부산지하철 1호선)\n' +
						'소요 시간: 약 30분\n' +
						'\n' +
						'양정동 내 이동 (도보 또는 지역 버스)\n' +
						'(1) 양정동 중앙시장(화장실 O)\n' +
						'고고횟집(1인 가성비 횟집)\n' +
						'\n' +
						'(2) 양정동 카페 거리(화장실 O)\n' +
						'카페 세컨드플로어\n' +
						'카페 에이치\n' +
						'\n' +
						'(3) 부산 동래 온천(화장실 O)\n' +
						'동래온천호텔\n' +
						'\n' +
						'총 경비: 약 50,000원'
				}
			},
			required: ['hotel', 'course', 'message']
		});

		const prompt = `
			Previous itinerary: ${JSON.stringify(body.course)}
			Please modify the itinerary according to the following:
			1. Ensure all locations are real and accurately placed in ${body.location}.
			2. Provide accurate latitude and longitude coordinates for every location.
			3. Adjust times to avoid any overlap.
			4. Do not place food locations consecutively, and avoid revisiting locations from previous days.
			5. Summarize the total course and message it like the example.
			6. The response should be in Korean.

			Specific modification request: ${JSON.stringify(body.message)}
		`;

		const data = await model.generateContent(prompt, );

		return JSON.parse(data.response.text());
	}
}
