
export class Bubble {

	// static defaultTexture = "icons/vtt.png";
	// static particlesPerWave = 6;
	// static scale = 1;
	// static moveSpeed = 1;
	imagePaths = [];

	static addHTMLFeilds(element) {
		// 	const doc = element.object;

		// 	let textureSRC = doc.flags?.["particle-pandemonium"]?.texture.src ?? Bubble.defaultTexture;
		// 	let particlesPerWave = doc.flags?.["particle-pandemonium"]?.particlesPerWave ?? Bubble.particlesPerWave;
		// 	let scale = doc.flags?.["particle-pandemonium"]?.scale ?? Bubble.scale;
		// 	let moveSpeed = doc.flags?.["particle-pandemonium"]?.moveSpeed ?? Bubble.moveSpeed;

		// 	// let textureSRC = doc.flags["particle-pandemonium"]?.texture?.src || "icons/anvil.png";
		// 	const html = `
		//    <div class="form-group">
		// 		<label>Texture Image</label>
		// 		<div class="form-fields">
		// 			<file-picker value="${textureSRC}" name="flags.particle-pandemonium.texture.src" type="imagevideo"><input class="image" type="text" placeholder="path/to/file.ext"><button class="fa-solid fa-file-import fa-fw" type="button" data-tooltip="Browse Files" aria-label="Browse Files" tabindex="-1"></button></file-picker>
		// 		</div>
		// 	</div>

		//    <div class="form-group">
		// 		<label>Particles Per Wave</label>
		// 		<input type="number" value="${particlesPerWave}" name="flags.particle-pandemonium.particlesPerWave" placeholder="6"  data-dtype="Number" />
		// 	</div>      

		//    <div class="form-group">
		// 		<label>Image Scale</label>
		// 		<input type="number" value="${scale}" name="flags.particle-pandemonium.scale" placeholder="1" step="0.01" data-dtype="Number" />
		// 	</div>

		//    <div class="form-group">
		// 		<label>Movement Speed</label>
		// 		<input type="number" value="${moveSpeed}" name="flags.particle-pandemonium.moveSpeed" placeholder="1" step="0.01" data-dtype="Number" />
		// 	</div>
		// 	`;

		// 	element.form.querySelector(`.function-elements`).innerHTML = html;
	}

	async prepareEmitterData(document) {

		const configURL = document.flags?.["particle-pandemonium"]?.animationURL ?? 'modules/particle-pandemonium/assets/animation/anim-bubble-pop.json';
		const animatedSingleConfig = await foundry.utils.fetchJsonWithTimeout(configURL);

		const func = {
			"lifetime": {
				"min": 2,
				"max": 3
			},
			"frequency": 0.1, //0.056,
			// "emitterLifetime": 5,
			"maxParticles": 500,
			// "addAtBack": false,
			pos: { x: document.x, y: document.y },
			// autoUpdate: true,
			"behaviors": [
				{
					"type": "moveSpeed",
					"config": {
						"speed": {
							"list": [
								{
									"time": 0,
									"value": 200
								},
								{
									"time": 1,
									"value": 50
								}
							]
						}
					}
				},
				{
					"type": "scale",
					"config": {
						"scale": {
							"list": [
								{
									"time": 0,
									"value": 0.25
								},
								{
									"time": 1,
									"value": 0.75
								}
							]
						},
						"minMult": 0.5
					}
				},
				{
					"type": "rotation",
					"config": {
						"accel": 0,
						"minSpeed": 0,
						"maxSpeed": 50,
						"minStart": 0,
						"maxStart": 360
					}
				},
				{
					type: "animatedSingle",
					config: {
						anim: animatedSingleConfig
						// {
						// 	framerate: -1,
						// 	textures:[
						// 		{texture: "modules/particle-pandemonium/assets/images/Bubbles99.png", count: 80},
						// 		{texture: "modules/particle-pandemonium/assets/images/Pop1.png", count: 1},
						// 		{texture: "modules/particle-pandemonium/assets/images/Pop2.png", count: 1},
						// 		{texture: "modules/particle-pandemonium/assets/images/Pop3.png", count: 1},
						// 	],
						// }
					}
				},
				{
					"type": "spawnPoint",
					"config": {}
				},
			]
		};
		return func;
	}
}
