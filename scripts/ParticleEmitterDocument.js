import { BaseParticleEmitter } from './BaseParticleEmitter.js'

/**
 * The client-side ParticleEmitter embedded document which extends the common BaseParticleEmitter abstraction.
 * Each ParticleEmitter document contains ParticleEmitterData which defines its data schema.
 *
 * @extends abstract.Document
 * @extends abstract.BaseParticleEmitter
 * @extends ClientDocumentMixin
 *
 * @see {@link data.ParticleEmitterData}                 The ParticleEmitter data schema
 * @see {@link documents.Scene}                   The Scene document type which contains ParticleEmitter embedded documents
 * @see {@link applications.LightConfig}          The ParticleEmitter configuration application
 *
 * @param {data.ParticleEmitterData} [data={}]       Initial data provided to construct the ParticleEmitter document
 * @param {Scene} parent                The parent Scene document to which this ParticleEmitter belongs
 */
export class ParticleEmitterDocument extends CanvasDocumentMixin(BaseParticleEmitter) { }
