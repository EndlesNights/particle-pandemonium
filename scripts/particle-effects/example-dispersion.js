
export class ExampleClass {

    static defaultTexture = "icons/vtt.png";
    static particlesPerWave = 6;
    static scale = 1;
    static moveSpeed = 1;

    static addHTMLFeilds(element) {
        const doc = element.object;

        let textureSRC = doc.flags?.["particle-pandemonium"]?.texture.src ?? ExampleClass.defaultTexture;
        let particlesPerWave = doc.flags?.["particle-pandemonium"]?.particlesPerWave ?? ExampleClass.particlesPerWave;
        let scale = doc.flags?.["particle-pandemonium"]?.scale ?? ExampleClass.scale;
        let moveSpeed = doc.flags?.["particle-pandemonium"]?.moveSpeed ?? ExampleClass.moveSpeed;

        // let textureSRC = doc.flags["particle-pandemonium"]?.texture?.src || "icons/anvil.png";
        const html = `
       <div class="form-group">
            <label>Texture Image</label>
            <div class="form-fields">
                <file-picker value="${textureSRC}" name="flags.particle-pandemonium.texture.src" type="imagevideo"><input class="image" type="text" placeholder="path/to/file.ext"><button class="fa-solid fa-file-import fa-fw" type="button" data-tooltip="Browse Files" aria-label="Browse Files" tabindex="-1"></button></file-picker>
            </div>
        </div>
        
       <div class="form-group">
            <label>Particles Per Wave</label>
            <input type="number" value="${particlesPerWave}" name="flags.particle-pandemonium.particlesPerWave" placeholder="6"  data-dtype="Number" />
        </div>      

       <div class="form-group">
            <label>Image Scale</label>
            <input type="number" value="${scale}" name="flags.particle-pandemonium.scale" placeholder="1" step="0.01" data-dtype="Number" />
        </div>

       <div class="form-group">
            <label>Movement Speed</label>
            <input type="number" value="${moveSpeed}" name="flags.particle-pandemonium.moveSpeed" placeholder="1" step="0.01" data-dtype="Number" />
        </div>
        `;

        element.form.querySelector(`.function-elements`).innerHTML = html;
    }

    async prepareEmitterData(document) {
        const texture = document.flags?.["particle-pandemonium"]?.texture.src ?? ExampleClass.defaultTexture;
        // const randomLeaf = Math.floor(Math.random() * 6) + 1;
        const func = {
            lifetime: { min: 3, max: 3 },
            frequency: 1,
            spawnChance: 1,
            particlesPerWave: document.flags?.["particle-pandemonium"]?.particlesPerWave ?? ExampleClass.particlesPerWave,
            // emitterLifetime: 2.5,
            maxParticles: 100,
            pos: {x:document.x, y:document.y},
            autoUpdate: true,
            behaviors: [
                {
                    type: "alpha",
                    config: {
                        alpha: {
                            list: [{ time: 1, value: 0.9 }, { time: 1, value: 0.5 }]
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
                    config: { accel: 0, minSpeed: 100, maxSpeed: 200, minStart: 0, maxStart: 365 }
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

Hooks.on("renderParticleEmitterConfig", (app, html, data) => {
    if (app.object.particleFunction !== "example") return;
    app.checkFunctionHTML();
});
