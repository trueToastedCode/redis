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
  async function set ({ id, content, timeLeftS, expireAt, unique = true }) {
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
    await client.set(
      id,
      content,
      timeLeftS ? { EX: timeLeftS } : undefined
    )
    return { id, content }
  }
  /**
   * 
   * @param {object} info - Object to be cached
   * @param {number} timeLeftS - Time left before removal in seconds
   * @param {number} expireAt - Timestamp in milliseoconds for removal
   * @returns {object} Cached object
   */
  async function setObj ({ info, timeLeftS, expireAt, unique = true }) {
    await set({
      id: info.id,
      content: JSON.stringify(info),
      timeLeftS,
      expireAt,
      unique
    })
    return info
  }
  async function find ({ id }) {
    const client = await makeCache()
    return client.get(id)
  }
  async function findObj ({ id }) {
    const result = await find({ id })
    return result ? JSON.parse(result) : null
  }
  async function remove ({ id }) {
    const client = await makeCache()
    return client.del(id)
  }
}