const fields = foundry.data.fields

/**
 * The data schema for a ParticleEmitter embedded document.
 * @extends DocumentData
 * @memberof data
 * @see BaseParticleEmitter
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseParticleEmitter} [document]       The embedded document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this BaseParticleEmitter embedded document
 * @property {number} [x=0]               The x-coordinate position of the origin of the particleEmitter
 * @property {number} [y=0]               The y-coordinate position of the origin of the particleEmitter
 * @property {string} [scene]             Target (partner) scene id or `null` if current scene
 * @property {string} [name]              ParticleEmitter name (id for connection)
 * @property {string} [label]             ParticleEmitter label
 * @property {string} [fontFamily]        Label font family
 * @property {number} [fontSize]          Label font size
 * @property {string} [textColor]         Label text color
 * @property {string} [icon]              ParticleEmitter icon (image path) or `null` for default
 * @property {number} [width]             ParticleEmitter icon width
 * @property {number} [height]            ParticleEmitter icon height
 * @property {boolean} [disabled]         Disabled (locked on `true`)
 * @property {boolean} [hidden]           Hide from players (hidden on `true`)
 * @property {boolean} [animate]          Animate movement within scene (animate on `true`)
 * @property {boolean} [partnerSceneLabel] Use the name of the partner scene as label
 */

/**
 * The Document definition for a ParticleEmitter.
 * Defines the DataSchema and common behaviors for a ParticleEmitter.
 * @extends abstract.Document
 * @mixes ParticleEmitterData
 * @memberof documents
 *
 * @param {ParticleEmitterData} data                 Initial data from which to construct the ParticleEmitter
 * @param {DocumentConstructionContext} context   Construction context options
 */
export class BaseParticleEmitter extends foundry.abstract.Document {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** @inheritdoc */
  /* TODO: linter work-around
  static metadata = Object.freeze(foundry.utils.mergeObject(foundry.abstract.Document.metadata, {
    name: 'ParticleEmitter',
    collection: 'particleEmitters',
    label: 'DOCUMENT.ParticleEmitter',
    labelPlural: 'DOCUMENT.ParticleEmitter'
  }, { inplace: false }))
  */

  /** @inheritdoc */
  static defineSchema () {
    return {
      _id: new fields.DocumentIdField(),
      scene: new fields.ForeignDocumentField(BaseParticleEmitter, { idOnly: true, required: false, nullable: true }),
      // name: new fields.StringField({ required: true, blank: false }),
      x: new fields.NumberField({ required: true, nullable: false, integer: true }),
      y: new fields.NumberField({ required: true, nullable: false, integer: true }),
      elevation: new fields.NumberField({required: true, nullable: false, initial: 0}),
      rotation: new fields.AngleField(),
      vision: new fields.BooleanField(),
      particleFunction: new fields.StringField({required: true}),
      icon: new fields.FilePathField({ categories: ['IMAGE'] }),
      width: new fields.NumberField({ positive: true }),
      height: new fields.NumberField({ positive: true }),
      disabled: new fields.BooleanField(),
      hidden: new fields.BooleanField(),
      animate: new fields.BooleanField(),
      partnerSceneLabel: new fields.BooleanField(),
      flags: new fields.ObjectField({ required: false, default: {} })
    }
  }
}

// TODO: linter work-around
BaseParticleEmitter.metadata = Object.freeze(foundry.utils.mergeObject(foundry.abstract.Document.metadata, {
  name: 'ParticleEmitter',
  collection: 'particleEmitters',
  label: 'Particle Emitter',
  labelPlural: 'Particle Emitters'
}, { inplace: false }))
