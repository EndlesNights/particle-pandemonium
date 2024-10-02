import { ParticleEmitterDocument } from './ParticleEmitterDocument.js'
import { MODULE_ID } from './toolbar.js'

export const PARTICLE_EMITTER_DEFAULTS = {
  scene: 'null',
  icon: 'icons/svg/explosion.svg',
  width: 0.4,
  height: 0.4,
  fontFamily: CONFIG.defaultFontFamily,
  fontSize: 24,
  textColor: '#FFFFFF'
}
export const NO_RESET_DEFAULT = ['name', 'scene', 'x', 'y']

export const COLOR = {
  onScene: 0x000000,
  onTargetScene: 0x000080,
  noPartnerOtherScene: 0xffbf00,
  noPartner: 0xffbf00,
  nonMonogamous: 0xde3264
}

/**
 * ParticleEmitter Configuration Sheet
 * @implements {DocumentSheet}
 *
 * @param particleEmitter {ParticleEmitter} The ParticleEmitter object for which settings are being configured
 * @param options {Object}     ParticleEmitterConfig ui options (see Application)
 */
export class ParticleEmitterConfig extends DocumentSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'particleEmitter-config',
      classes: ['sheet', 'particleEmitter-sheet'],
      title: 'particle-pandemonium.ui.config.title',
      template: 'modules/particle-pandemonium/templates/particle-emitter-config.html',
      width: 480,
      height: 'auto',
      tabs: [{ navSelector: '.tabs', contentSelector: 'form', initial: 'main' }]
    })
  }

  /* -------------------------------------------- */

  /** @override */
  async _render(force, options) {
    if (!this.rendered) this.original = this.object.clone({}, { keepId: true })
    return super._render(force, options)
  }

  /* -------------------------------------------- */

  /** @override */
  getData(options) {
    const data = super.getData(options)
    const scenes = {
      null: game.i18n.localize('particle-pandemonium.ui.config.current-scene')
    }
    for (const scene of game.scenes) {
      scenes[scene.id] = scene.name
    }

    const iconName = (name) => game.i18n.localize(`particle-pandemonium.ui.config.icons.${name}`)
    const icons = {
      [PARTICLE_EMITTER_DEFAULTS.icon]: iconName('particleEmitter'),
      'icons/svg/door-steel.svg': iconName('door-steel'),
      'icons/svg/door-closed.svg': iconName('door-closed'),
      'icons/svg/door-exit.svg': iconName('door-exit'),
      'icons/svg/cave.svg': iconName('cave'),
      'icons/svg/house.svg': iconName('house'),
      'icons/svg/city.svg': iconName('city'),
      'icons/svg/castle.svg': iconName('castle')
    }

    const fontFamilies = Object.keys(CONFIG.fontDefinitions).reduce((obj, f) => {
      obj[f] = f
      return obj
    }, {})

    // replace null with defaults
    for (const key in PARTICLE_EMITTER_DEFAULTS) {
      data.data[key] ??= PARTICLE_EMITTER_DEFAULTS[key]
    }


    data.particleFunctionTypes = this._getParticleFunctionTypes();
    // this.checkFunctionHTML();
    data.id = {};
    if (this.object.particleFunction) { data.id[this.object.particleFunction] = true };
    console.log(data.id)
    return {
      ...data,
      status: this.document.object.status,
      scenes,
      icons,
      fontFamilies,
      submitText: game.i18n.localize('particle-pandemonium.ui.config.submit')
    }
  }

  /* -------------------------------------------- */

  _getParticleFunctionTypes() {
    // data.particleFunctionTypes = CONFIG[`${MODULE_ID}`]?.particleFunctionTypes ?? {};

    const types = {};
    for (let [k, v] of Object.entries(CONFIG[`${MODULE_ID}`]?.particleFunctionTypes)) {
      types[k] = game.i18n.localize(v.label);
    }
    return types;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html)
    this.iconPicker = html.find('file-picker[name="icon"]')[0]
    html.find('img.select-icon').click(this._onSelectIcon.bind(this))
    html.find('button[name="resetDefault"]').click(this._onResetDefaults.bind(this))
  }

  /* -------------------------------------------- */

  _onSelectIcon(event) {
    const icon = event.currentTarget.attributes.src.value
    this.iconPicker.value = icon
    this.iconPicker.dispatchEvent(new Event('change', { bubbles: true }))
  }

  /* -------------------------------------------- */

  /**
   * Reset the ParticleEmitter configuration settings to their default values
   * @param event
   * @private
   */
  _onResetDefaults(event) {
    event.preventDefault()

    const defaults = ParticleEmitterDocument.cleanData()

    for (const key in defaults) {
      // don't reset internal and required fields
      if (key.startsWith('_') || NO_RESET_DEFAULT.includes(key)) {
        delete defaults[key]
        continue
      }

      // use default value or null
      defaults[key] = PARTICLE_EMITTER_DEFAULTS[key] ?? null
    }

    this._previewChanges(defaults)
    this.render()
  }

  /* -------------------------------------------- */

  /**
   * Preview changes to the ParticleEmitter document as if they were true document updates.
   * @param {object} change       Data which simulates a document update
   * @protected
   */
  _previewChanges(change) {
    this.object.updateSource(change)
    this.object._onUpdate(change, { render: false }, game.user.id)
  }

  /* -------------------------------------------- */

  /**
   * Restore the true data for the ParticleEmitter document when the form is submitted or closed.
   * @protected
   */
  _resetPreview() {
    this._previewChanges(this.original.toObject())
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async close(options = {}) {
    if (!options.force) this._resetPreview()
    return super.close(options)
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _onChangeInput(event) {

    await super._onChangeInput(event)
    const previewData = this._getSubmitData()
    this._previewChanges(previewData)

    if(event.target.name === "particleFunction") this.checkFunctionHTML();
  }

  /* -------------------------------------------- */

  /** @override */
  _getSubmitData(updateData = {}) {
    const formData = super._getSubmitData(updateData)

    // replace default values with null
    for (const key in PARTICLE_EMITTER_DEFAULTS) {
      if (formData[key] === PARTICLE_EMITTER_DEFAULTS[key]) {
        formData[key] = null
      }
    }

    return formData
  }

  /* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {
    this._resetPreview()
    if (this.object.id) return this.object.update(formData)
    return this.object.constructor.create(formData, { parent: canvas.scene })
  }

  async checkFunctionHTML() {
    this.clearFunctionHTML();
    if (!this.object.particleFunction) return;

    CONFIG[`${MODULE_ID}`]?.particleFunctionTypes[this.object.particleFunction].effectClass.addHTMLFeilds(this);
    // this._element.style.height = 'auto';
    this._element.css('height', 'auto');

  }

  clearFunctionHTML() {
    const functionElement = this.form.querySelectorAll(`.function-elements`);
    // Remove all child elements from each matched element
    Array.from(functionElement).forEach((element) => {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    });
  }
}
