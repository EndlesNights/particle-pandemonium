
export class ExampleClass {

    static defaultTexture = "icons/vtt.png";
    static particlesPerWave = 6;
    static particlesMax = 500;
    static scale = 1;
    static moveSpeed = 1;
    static frequencyMultiplier = 1;
    static lifetimeMin = 3;
    static lifetimeMax = 4;

    static addHTMLFeilds(element) {
        const doc = element.object;

        let textureSRC = doc.flags?.["particle-pandemonium"]?.texture.src ?? ExampleClass.defaultTexture;
        let particlesPerWave = doc.flags?.["particle-pandemonium"]?.particlesPerWave ?? ExampleClass.particlesPerWave;
        let particlesMax = doc.flags?.["particle-pandemonium"]?.particlesMax ?? ExampleClass.particlesMax;
        let scale = doc.flags?.["particle-pandemonium"]?.scale ?? ExampleClass.scale;
        let moveSpeed = doc.flags?.["particle-pandemonium"]?.moveSpeed ?? ExampleClass.moveSpeed;
        let frequencyMultiplier = doc.flags?.["particle-pandemonium"]?.frequencyMultiplier ?? ExampleClass.frequencyMultiplier;
        let lifetimeMin = doc.flags?.["particle-pandemonium"]?.lifetimeMin ?? ExampleClass.lifetimeMin;
        let lifetimeMax = doc.flags?.["particle-pandemonium"]?.lifetimeMax ?? ExampleClass.lifetimeMax;

        const html = `
       <div class="form-group">
            <label>Texture Image</label>
            <div class="form-fields">
                <file-picker value="${textureSRC}" name="flags.particle-pandemonium.texture.src" type="imagevideo"><input class="image" type="text" placeholder="path/to/file.ext"><button class="fa-solid fa-file-import fa-fw" type="button" data-tooltip="Browse Files" aria-label="Browse Files" tabindex="-1"></button></file-picker>
            </div>
        </div>

        <div class="form-group slim">
            <label>Lifetime</label>
                <div class="form-fields">
                    <label>Min</label>
                    <input type="number" value="${lifetimeMin}" name="flags.particle-pandemonium.lifetimeMin" placeholder="3" step="0.01" data-dtype="Number" />
                    <label>Max</label>
                    <input type="number" value="${lifetimeMax}" name="flags.particle-pandemonium.lifetimeMax" placeholder="4" step="0.01" data-dtype="Number" />
                </div>
        </div>

       <div class="form-group slim">
            <label>Frequency Multiplier</label>
            <div class="form-fields">
                <input type="number" value="${frequencyMultiplier}" name="flags.particle-pandemonium.frequencyMultiplier" placeholder="1" step="0.01" data-dtype="Number" />
                </div>
        </div>

        <div class="form-group slim">
            <label>Particles Per Wave</label>
            <div class="form-fields">
                <input type="number" value="${particlesPerWave}" name="flags.particle-pandemonium.particlesPerWave" placeholder="6"  data-dtype="Number" />
                </div>
        </div>

        <div class="form-group slim">
            <label>Max Particles Particles</label>
            <div class="form-fields">
                <input type="number" value="${particlesMax}" name="flags.particle-pandemonium.particlesMax" placeholder="500"  data-dtype="Number" />
                </div>
        </div>

       <div class="form-group slim">
            <label>Image Scale</label>
            <div class="form-fields">
                <input type="number" value="${scale}" name="flags.particle-pandemonium.scale" placeholder="1" step="0.01" data-dtype="Number" />
                </div>
        </div>

       <div class="form-group slim">
            <label>Movement Speed Multiplier</label>
            <div class="form-fields">
                <input type="number" value="${moveSpeed}" name="flags.particle-pandemonium.moveSpeed" placeholder="1" step="0.01" data-dtype="Number" />
                </div>
        </div>
        `;

        element.form.querySelector(`.function-elements`).innerHTML = html;
    }

    async prepareEmitterData(document) {
        const texture = document.flags?.["particle-pandemonium"]?.texture.src ?? ExampleClass.defaultTexture;
        const func = {
            lifetime: {
                min: document.flags?.["particle-pandemonium"]?.lifetimeMin ?? ExampleClass.lifetimeMin,
                max: document.flags?.["particle-pandemonium"]?.lifetimeMax ?? ExampleClass.lifetimeMax
            },
            frequency: 0.056 / (document.flags?.["particle-pandemonium"]?.frequencyMultiplier ?? ExampleClass.frequencyMultiplier),
            particlesPerWave: document.flags?.["particle-pandemonium"]?.particlesPerWave ?? ExampleClass.particlesPerWave,
            maxParticles: document.flags?.["particle-pandemonium"]?.particlesMax ?? ExampleClass.particlesMax,
            pos: { x: document.x, y: document.y },
            behaviors: [
                {
                    type: "alpha",
                    config: {
                        alpha: {
                            list: [{ time: 0, value: 1 }, { time: 1, value: 0.02 }]
                        }
                    }
                },
                {
                    type: "moveSpeed",
                    config: {
                        speed: {
                            list: [{ time: 1, value: 20 }, { time: 1, value: 60 }]
                        },
                        minMult: 0.6 * (document.flags?.["particle-pandemonium"]?.moveSpeed ?? ExampleClass.moveSpeed)
                    }
                },
                {
                    type: "scale",
                    config: {
                        scale: {
                            list: [{ time: 1, value: 0.2 }, { time: 1, value: 0.4 }]
                        },
                        minMult: 0.5 * (document.flags?.["particle-pandemonium"]?.scale ?? ExampleClass.scale)
                    }
                },
                {
                    type: "rotation",
                    config: { accel: 0, minSpeed: 0, maxSpeed: 10, minStart: 0, maxStart: 360 }
                },
                {
                    type: 'textureSingle',
                    config: { texture: texture }
                }
            ]
        };
        return func;
    }
}
