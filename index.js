export default function makeDefaultCacheFunctions ({ makeCache }) {
  return Object.freeze({
    setObj,
    findObj,
    remove
  })
  async function setObj ({ info, timeLeftMs, callback }) {
    const client = await makeCache()
    if (timeLeftMs) {
      await client.set(info.id, JSON.stringify(info), 'EX', Math.round(timeLeftMs / 1000), callback)
    } else {
      await client.set(info.id, JSON.stringify(info))
    }
    return info
  }
  async function findObj ({ id }) {
    const client = await makeCache()
    return client.get(id)
  }
  async function remove ({ id }) {
    const client = await makeCache()
    return client.del(id)
  }
}