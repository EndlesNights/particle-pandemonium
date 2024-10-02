// CONFIG[`${MODULE_ID}`].particleFunctionTypes.example = {
//     id:"example",
//     label: "Example Function",
//     effectClass: ExampleClass
// }

export class ExampleClass {

    defaultTexture() {
        return "icons/anvil.png";
    }

    static addHTMLFeilds(element) {
        const doc = element.object;
        console.log("Add HTML");
        console.log(element);

        console.log(doc)
        console.log(doc.flags)
        let textureSRC = doc.flags?.["particle-pandemonium"]?.texture.src ?? this.defaultTexture();

        // let textureSRC = doc.flags["particle-pandemonium"]?.texture?.src || "icons/anvil.png";
        const html = `
       <div class="form-group">
            <label>Texture Image</label>
            <div class="form-fields">
                <file-picker value="${textureSRC}" name="flags.particle-pandemonium.texture.src" type="imagevideo"><input class="image" type="text" placeholder="path/to/file.ext"><button class="fa-solid fa-file-import fa-fw" type="button" data-tooltip="Browse Files" aria-label="Browse Files" tabindex="-1"></button></file-picker>
            </div>
        </div>`;

        element.form.querySelector(`.function-elements`).innerHTML = html;
    }

    static async prepareEmitterData(document) {
        const texture = document.flags?.["particle-pandemonium"]?.texture.src ?? this.defaultTexture();
        // const randomLeaf = Math.floor(Math.random() * 6) + 1;
        console.log(document)
        const func = {
            lifetime: { min: 3, max: 3 },
            frequency: 1,
            spawnChance: 1,
            particlesPerWave: 6,
            // emitterLifetime: 2.5,
            maxParticles: 10,
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
                        minMult: 0.6
                    }
                },
                {
                    type: "scale",
                    config: {
                        scale: {
                            list: [{ time: 1, value: 0.2 }, { time: 1, value: 0.4 }]
                        },
                        minMult: 0.5
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

    console.log(app)
    console.log(html)
    console.log(data)

    app.checkFunctionHTML();
});


