export default function makeDefaultCacheFunctions ({ makeCache }) {
  return Object.freeze({
    set,
    find,
    remove
  })
  async function set ({ id, info, timeLeftMs, callback }) {
    const client = await makeCache()
    if (timeLeftMs) {
      await client.set(id, info, 'EX', Math.round(timeLeftMs / 1000), callback)
    } else {
      await client.set(id, info)
    }
    return { id, ...info }
  }
  async function find ({ id }) {
    const client = await makeCache()
    return client.get(id)
  }
  async function remove ({ id }) {
    const client = await makeCache()
    return client.del(id)
  }
}