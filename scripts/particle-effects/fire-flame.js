
export class FireFlame {

	static frequencyMultiplier = 1;

	static radius = 10;
	static innerRadius = 0;

	static flameColorPrimary = "#fff191";
    static flameColorSecond = "#ff622c";
	static smokeColorPrimary = "#111111";
    static smokeColorSecond = "#333333";

	static addHTMLFeilds(element) {
		const doc = element.object;
		let affectRotationToggle = doc.flags?.["particle-pandemonium"]?.affectRotationToggle ?? false;
        let frequencyMultiplier = doc.flags?.["particle-pandemonium"]?.frequencyMultiplier ?? FireFlame.frequencyMultiplier;

		let radius = doc.flags?.["particle-pandemonium"]?.radius ?? FireFlame.radius;
		let innerRadius = doc.flags?.["particle-pandemonium"]?.innerRadius ?? FireFlame.innerRadius;

		let flameColorPrimary = doc.flags?.["particle-pandemonium"]?.flameColorPrimary ?? FireFlame.flameColorPrimary;
        let flameColorSecond = doc.flags?.["particle-pandemonium"]?.flameColorSecond ?? FireFlame.flameColorSecond;

		let smokeColorPrimary = doc.flags?.["particle-pandemonium"]?.smokeColorPrimary ?? FireFlame.smokeColorPrimary;
        let smokeColorSecond = doc.flags?.["particle-pandemonium"]?.smokeColorSecond ?? FireFlame.smokeColorSecond;

		
		const html = `
		<div class="form-group"><label>Render Shape</label>
			<div class="form-fields">
				<input type="checkbox" ${affectRotationToggle ? "checked" : ""}  name="flags.particle-pandemonium.affectRotationToggle" data-dtype="Boolean">
			</div>
		</div>

       <div class="form-group slim">
            <label>Frequency Multiplier</label>
            <div class="form-fields">
                <input type="number" value="${frequencyMultiplier}" name="flags.particle-pandemonium.frequencyMultiplier" placeholder="1" step="0.01" data-dtype="Number" />
            </div>
        </div>

		<div class="form-group slim">
			<label>Emiter Radius</label>
			<div class="form-fields">
				<input type="number" value="${radius}" name="flags.particle-pandemonium.radius" placeholder="1" step="0.01" data-dtype="Number" />
			</div>
		</div>

		<div class="form-group slim">
			<label>Emiter Inner Radius</label>
			<div class="form-fields">
				<input type="number" value="${innerRadius}" name="flags.particle-pandemonium.innerRadius" placeholder="1" step="0.01" data-dtype="Number" />
			</div>
		</div>

		<legend>Flame Colours</legend>

        <div class="form-group">
            <label>Primary Color</label>
            <div class="form-fields">
                <color-picker value="${flameColorPrimary}" name="flags.particle-pandemonium.flameColorPrimary">
                <input type="text" placeholder="">
                <input type="color">
                </color-picker>
            </div>
            <p class="hint">Apply coloration to this light source and configure its intensity.</p>
        </div>

        <div class="form-group">
            <label>Secondary Color</label>
            <div class="form-fields">
                <color-picker value="${flameColorSecond}" name="flags.particle-pandemonium.flameColorSecond">
                <input type="text" placeholder="">
                <input type="color">
                </color-picker>
            </div>
            <p class="hint">Apply coloration to this light source and configure its intensity.</p>
        </div>

		<legend>Smoke Colours</legend>

        <div class="form-group">
            <label>Primary Color</label>
            <div class="form-fields">
                <color-picker value="${smokeColorPrimary}" name="flags.particle-pandemonium.smokeColorPrimary">
                <input type="text" placeholder="">
                <input type="color">
                </color-picker>
            </div>
            <p class="hint">Apply coloration to this light source and configure its intensity.</p>
        </div>

        <div class="form-group">
            <label>Secondary Color</label>
            <div class="form-fields">
                <color-picker value="${smokeColorSecond}" name="flags.particle-pandemonium.smokeColorSecond">
                <input type="text" placeholder="">
                <input type="color">
                </color-picker>
            </div>
            <p class="hint">Apply coloration to this light source and configure its intensity.</p>
        </div>
		`;
		element.form.querySelector(`.function-elements`).innerHTML = html;
	}

	async prepareEmitterData(document) {

		const radius = document.flags?.["particle-pandemonium"]?.radius ?? FireFlame.radius;
		const innerRadius = document.flags?.["particle-pandemonium"]?.innerRadius ?? FireFlame.innerRadius;

		const affectRotationToggle = document.flags?.["particle-pandemonium"]?.affectRotationToggle ?? false;
		const flameColorPrimary = document.flags?.["particle-pandemonium"]?.flameColorPrimary ?? FireFlame.flameColorPrimary;
		const flameColorSecond = document.flags?.["particle-pandemonium"]?.flameColorSecond ?? FireFlame.flameColorSecond;
		const smokeColorPrimary = document.flags?.["particle-pandemonium"]?.smokeColorPrimary ?? FireFlame.smokeColorPrimary;
		const smokeColorSecond = document.flags?.["particle-pandemonium"]?.smokeColorSecond ?? FireFlame.smokeColorSecond;

		const speedMulti = 1;
		const scaleMulti = 1;

		const func = {
			"lifetime": {
				"min": 1.5,
				"max": 2.0
			},
			"frequency": 0.01 / (document.flags?.["particle-pandemonium"]?.frequencyMultiplier ?? FireFlame.frequencyMultiplier),
			"emitterLifetime": -1,
			"maxParticles": 1000,
			"addAtBack": false,
			pos: { x: document.x, y: document.y },
			"behaviors": [
				{
					"type": "alpha",
					"config": {
						"alpha": {
							"list": [
								{
									"value": 0.62,
									"time": 0
								},
								{
									"value": 0,
									"time": 0.9
								},
								{
									"value": 0,
									"time": 1.1
								},
								{
									"value": 0.8,
									"time": 1.11
								},
								{
									"value": 0,
									"time": 2.5
								}
							],
							"isStepped": false
						}
					}
				},
				{
					"type": "moveSpeed",
					"config": {
						"speed": {
							"list": [
								{
									"value": 50 * speedMulti,
									"time": 0
								},
								{
									"value": 45 * speedMulti,
									"time": 1.5
								},
								{
									"value": 45 * speedMulti,
									"time": 2
								}
							],
							"isStepped": true
						},
						"minMult": 1
					}
				},
				{
					"type": "scale",
					"config": {
						"scale": {
							"list": [
								{
									"value": 0.25 * scaleMulti,
									"time": 0
								},
								{
									"value": 0.75 * scaleMulti,
									"time": 2
								}
							],
							"isStepped": false
						},
						"minMult": 1
					}
				},
				{
					"type": "color",
					"config": {
						"color": {
							"list": [
								{
									"value": flameColorPrimary, //"fff191",
									"time": 0
								},
								{
									"value": flameColorSecond, //"ff622c",
									"time": 0.5
								},
								{
									"value": smokeColorPrimary, //"111111",
									"time": 0.6
								},
								{
									"value": smokeColorSecond, //"333333",
									"time": 2
								}
							],
							"isStepped": false
						}
					}
				},
				{
					"type": "rotation",
					"config": {
						"accel": 0,
						"minSpeed": 50,
						"maxSpeed": 50,
						"minStart": 255 + document.rotation,
						"maxStart": 285  + document.rotation
					}
				},
				
                // {
                //     type: "rotation",
                //     config: { accel: 0, minSpeed: 0, maxSpeed: 10, minStart: 0, maxStart: 360 }
                // },
				{
					"type": "textureRandom",
					"config": {
						"textures": [
							// "modules/particle-pandemonium/assets/images/fire/spark.png",
							"modules/particle-pandemonium/assets/images/particle.png",
							"modules/particle-pandemonium/assets/images/fire/fire_1.png",
							"modules/particle-pandemonium/assets/images/fire/fire_2.png",
							"modules/particle-pandemonium/assets/images/fire/fire_3.png",
							"modules/particle-pandemonium/assets/images/fire/fire_4.png",
						]
					}
				},
				{
					"type": "spawnShape",
					"config": {
						"type": "torus",
						"data": {
							"x": 0,
							"y": 0,
							"radius": radius,
							"innerRadius": innerRadius,
							"affectRotation": affectRotationToggle
						}
					}
				}
			]
		};
		return func;
	}
}
