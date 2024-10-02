import { MODULE_ID } from './settings.js'

const CURRENT_VERSION = '0.7.1'

export const performMigrations = async () => {
  // only run migrations as GM
  if (!game.user.isGM) {
    return
  }

  // data version
  const dataVersion = game.settings.get(MODULE_ID, 'dataVersion')

  // set data version on first install
  if (dataVersion === 'fresh install') {
    await setCurrentVersion()
  } else if (dataVersion === '0.3.0') {
    await updateDataSchema()
  }
}

const setCurrentVersion = async () => {
  await game.settings.set(MODULE_ID, 'dataVersion', CURRENT_VERSION)
}

const updateDataSchema = async () => {
  const sceneErrors = []

  // make sure required fields are present
  for (const scene of game.scenes) {
    const particleEmitters = foundry.utils.duplicate(scene.flags[`particle-pandemonium`] || [])

    for (const particleEmitter of particleEmitters) {
      const errors = []

      // document id is required
      if (typeof particleEmitter._id !== 'string') {
        particleEmitter._id = foundry.utils.randomID(16)
        errors.push('_id')
      }

      // name is required
      if (typeof particleEmitter.name !== 'string') {
        particleEmitter.name = 'sw-' + foundry.utils.randomID(8)
        errors.push('name')
      }

      // position must be a number
      if (typeof particleEmitter.x !== 'number') {
        particleEmitter.x = 0
        errors.push('x')
      }
      if (typeof particleEmitter.y !== 'number') {
        particleEmitter.y = 0
        errors.push('y')
      }

      // log errors
      if (errors.length > 0) {
        sceneErrors.push(scene.id)
        console.error('Invalid particleEmitter data detected!')
        console.log(errors, particleEmitter, scene)
      }
    }

    // update data when fixed
    if (sceneErrors.includes(scene.id)) {
      await scene.update({ 'flags.particle-pandemonium': particleEmitters })
    }
  }

  await setCurrentVersion()

  // reload page when data was fixed
  if (sceneErrors.length > 0) {
    window.location.reload()
  }
}
