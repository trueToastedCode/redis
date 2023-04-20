export default function makeDefaultCacheFunctions ({ makeCache }) {
  return Object.freeze({
    setObj,
    findObj,
    remove
  })
  /**
   * 
   * @param {object} info - Object to be cached
   * @param {number} timeLeftS - Time left before removal in seconds
   * @param {number} expireAt - Timestamp in milliseoconds for removal
   * @param {function} callback - 
   * @returns {object} Cached object
   */
  async function setObj ({ info, timeLeftS, expireAt, callback }) {
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
    await client.set(
      info.id, JSON.stringify(info),
      timeLeftS ? { EX: timeLeftS } : undefined,
      callback
    )
    return info
  }
  async function findObj ({ id }) {
    const client = await makeCache()
    const result = await client.get(id)
    return result ? JSON.parse(result) : null
  }
  async function remove ({ id }) {
    const client = await makeCache()
    return client.del(id)
  }
}