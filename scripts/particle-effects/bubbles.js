
export class Bubble {

	// static defaultTexture = "icons/vtt.png";
	// static particlesPerWave = 6;
	// static scale = 1;
	// static moveSpeed = 1;

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
		const randomLeaf = Math.floor(Math.random() * 6) + 1;
		let images = [
			"ui/particles/leaf1.png",
			"ui/particles/leaf2.png",
			"ui/particles/leaf3.png",
			"ui/particles/leaf4.png",
			// "modules/particle-pandemonium/assets/images/Bubbles99.png",
			// "modules/particle-pandemonium/assets/images/Pop1.png",
			// "modules/particle-pandemonium/assets/images/Pop2.png",
			// "modules/particle-pandemonium/assets/images/Pop3.png",
		];
		let textureArray = [];
		for (let i = 0; i < 4; i++) {
			let texture = PIXI.Texture.from(images[i]);
			textureArray.push(texture);
		};

		const animatedSprite = new PIXI.AnimatedSprite(textureArray);
		animatedSprite.animationSpeed = 100;
		animatedSprite.blendMode = 1;
		animatedSprite.loop = false;
		animatedSprite.framerate = -1;

		console.log(animatedSprite)
		const func = {
			"lifetime": {
				"min": 3,
				"max": 4
			},
			"frequency": 1, //0.056,
			// "emitterLifetime": 5,
			"maxParticles": 500,
			// "addAtBack": false,
			pos: { x: document.x, y: document.y },
			// autoUpdate: true,
			"behaviors": [
				// {
				// 	"type": "alpha",
				// 	"config": {
				// 		"alpha": {
				// 			"list": [
				// 				{
				// 					"time": 0,
				// 					"value": 1
				// 				},
				// 				{
				// 					"time": 1,
				// 					"value": 0.02
				// 				}
				// 			]
				// 		}
				// 	}
				// },
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
				// {
				// 	"type": "scale",
				// 	"config": {
				// 		"scale": {
				// 			"list": [
				// 				{
				// 					"time": 0,
				// 					"value": 0.25
				// 				},
				// 				{
				// 					"time": 1,
				// 					"value": 0.75
				// 				}
				// 			]
				// 		},
				// 		"minMult": 0.5
				// 	}
				// },
				{
					"type": "rotation",
					"config": {
						"accel": 0,
						"minSpeed": 0,
						"maxSpeed": 10,
						"minStart": 0,
						"maxStart": 360
					}
				},
				{
					type: "textureRandom",
					config: {
						textures: //images
							[
								"ui/particles/leaf1.png",
								"ui/particles/leaf2.png",
								"ui/particles/leaf3.png",
								"ui/particles/leaf4.png",
							]
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

Hooks.on("renderParticleEmitterConfig", (app, html, data) => {
	if (app.object.particleFunction !== "gas") return;
	app.checkFunctionHTML();
});
