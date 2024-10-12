
export class Gas {

    static colorPrimary = "#6bff61";
    static colorSecond = "#d8ff4a";

    imagePaths = ["modules/particle-pandemonium/assets/images/smokeparticle.png", "modules/particle-pandemonium/assets/images/particle.png"];

    static addHTMLFeilds(element) {
        const doc = element.object;

        let colorPrimary = doc.flags?.["particle-pandemonium"]?.colorPrimary ?? Gas.colorPrimary;
        let colorSecond = doc.flags?.["particle-pandemonium"]?.colorSecond ?? Gas.colorSecond;


        // let textureSRC = doc.flags["particle-pandemonium"]?.texture?.src || "icons/anvil.png";
        const html = `
        <div class="form-group">
            <label>Primary Color</label>
            <div class="form-fields">
                <color-picker value="${colorPrimary}" name="flags.particle-pandemonium.colorPrimary">
                <input type="text" placeholder="">
                <input type="color">
                </color-picker>
            </div>
            <p class="hint">Apply coloration to this light source and configure its intensity.</p>
        </div>

        <div class="form-group">
            <label>Secondary Color</label>
            <div class="form-fields">
                <color-picker value="${colorSecond}" name="flags.particle-pandemonium.colorSecond">
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

        const func = {
            lifetime: {
                min: 2,
                max: 1.8
            },
            frequency: 0.01,
            emitterLifetime: 0,
            maxParticles: 1000,
            addAtBack: true,
            pos: {x:document.x, y:document.y},
            // autoUpdate: true,
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
                                    // value: "6bff61"
                                    value: document.flags?.["particle-pandemonium"]?.colorPrimary ?? Gas.colorPrimary
                                },
                                {
                                    time: 1,
                                    // value: "d8ff4a"
                                    value: document.flags?.["particle-pandemonium"]?.colorSecond ?? Gas.colorSecond
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
                            this.imagePaths[0],
                            this.imagePaths[1]
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
