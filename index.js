export default function makeDefaultCacheFunctions ({ makeCache }) {
  return Object.freeze({
    set,
    setObj,
    find,
    findObj,
    remove
  })
  /**
   * 
   * @param {string} id - Id of item
   * @param {string} content - Data of item
   * @param {number} timeLeftS - Time left before removal in seconds
   * @param {number} expireAt - Timestamp in milliseoconds for removal
   * @returns {object}
   */
  async function set ({ id, content, timeLeftS, expireAt, unique = true, lookUps = [] } = {}) {
    if (expireAt && timeLeftS) {
      throw new Error('Specify either timeLeftS or expireAt but not both')
    }
    if (expireAt) {
      const timeLeftMs = expireAt - Date.now()
      if (timeLeftMs < 1000) {
        throw new Error('expireAt has to be at least one second into the future')
      }
      timeLeftS = Math.round(timeLeftMs / 1000)
    }
    const client = await makeCache()
    if (unique && await find({ id })) {
      throw new Error('Cache duplication error')
    }
    const results = await Promise.all([
      client.set(
        id,
        content,
        timeLeftS ? { EX: timeLeftS } : undefined
      ),
      ...lookUps.map(lookUp => client.set(
        lookUp,
        id,
        timeLeftS ? { EX: timeLeftS } : undefined
      ))
    ])
    const anyNotOk = results.some(result => result !== 'OK')
    return anyNotOk ? null : { id, content }
  }
  /**
   * 
   * @param {object} info - Object to be cached
   * @param {number} timeLeftS - Time left before removal in seconds
   * @param {number} expireAt - Timestamp in milliseoconds for removal
   * @returns {object} Cached object
   */
  async function setObj ({ info, timeLeftS, expireAt, unique = true, lookUps } = {}) {
    const result = await set({
      id: info.id,
      content: JSON.stringify(info),
      timeLeftS,
      expireAt,
      unique,
      lookUps
    })
    return result ? info : null
  }
  async function find ({ id, lookUp } = {}) {
    if (id == null && lookUp == null) {
      throw new Error('No id or lookUp supplied')
    }
    const client = await makeCache()
    if (id == null) {
      id = await client.get(lookUp)
      if (id == null) return null
    }
    return client.get(id)
  }
  async function findObj ({ id, lookUp } = {}) {
    if (id == null && lookUp == null) {
      throw new Error('No id or lookUp supplied')
    }
    const result = await find({ id, lookUp })
    return result ? JSON.parse(result) : null
  }
  async function remove ({ id, lookUps = [] } = {}) {
    if (id == null) {
      throw new Error('No id or lookUp supplied')
    }
    const client = await makeCache()
    await Promise.all([
      client.del(id),
      ...lookUps.map(lookUp => client.del(lookUp))
    ])
    return true
  }
}