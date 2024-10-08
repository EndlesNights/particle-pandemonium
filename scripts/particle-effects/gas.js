
export class Gas {

    static defaultTexture = "icons/vtt.png";
    static particlesPerWave = 6;
    static scale = 1;
    static moveSpeed = 1;

    static addHTMLFeilds(element) {
        const doc = element.object;

        let textureSRC = doc.flags?.["particle-pandemonium"]?.texture.src ?? Gas.defaultTexture;
        let particlesPerWave = doc.flags?.["particle-pandemonium"]?.particlesPerWave ?? Gas.particlesPerWave;
        let scale = doc.flags?.["particle-pandemonium"]?.scale ?? Gas.scale;
        let moveSpeed = doc.flags?.["particle-pandemonium"]?.moveSpeed ?? Gas.moveSpeed;

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

        const func = {
            lifetime: {
                min: 2,
                max: 1.8
            },
            frequency: 0.1,
            emitterLifetime: 0,
            maxParticles: 1000,
            addAtBack: true,
            pos: {x:document.x, y:document.y},
            autoUpdate: true,
            behaviors: [
                {
                    type: "alpha",
                    config: {
                        alpha: {
                            list: [
                                {
                                    time: 0,
                                    value: 0.4
                                },
                                {
                                    time: 1,
                                    value: 0
                                }
                            ]
                        }
                    }
                },
                {
                    type: "moveSpeedStatic",
                    config: {
                        min: 10,
                        max: 10
                    }
                },
                {
                    type: "scale",
                    config: {
                        scale: {
                            list: [
                                {
                                    time: 0,
                                    value: 2
                                },
                                {
                                    time: 1,
                                    value: 0.4
                                }
                            ]
                        },
                        minMult: 1
                    }
                },
                {
                    type: "color",
                    config: {
                        color: {
                            list: [
                                {
                                    time: 0,
                                    value: "6bff61"
                                },
                                {
                                    time: 1,
                                    value: "d8ff4a"
                                }
                            ]
                        }
                    }
                },
                {
                    type: "rotationStatic",
                    config: {
                        min: 0,
                        max: 360
                    }
                },
                {
                    type: "blendMode",
                    config: {
                        blendMode: "screen"
                    }
                },
                {
                    type: "textureRandom",
                    config: {
                        textures: [
                            "modules/particle-pandemonium/assets/images/smokeparticle.png",
                            "modules/particle-pandemonium/assets/images/particle.png"
                        ]
                    }
                },
                {
                    type: "spawnShape",
                    config: {
                        type: "torus",
                        data: {
                            x: 0,
                            y: 0,
                            radius: 150,
                            innerRadius: 0,
                            affectRotation: false
                        }
                    }
                }
            ]
        };
        return func;
    }
}

Hooks.on("renderParticleEmitterConfig", (app, html, data) => {
    if (app.object.particleFunction !== "gas") return;
    app.checkFunctionHTML();
});
