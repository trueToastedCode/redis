export default function makeDefaultCacheFunctions ({ makeCache }) {
  return Object.freeze({
    setObj,
    findObj,
    remove
  })
  async function setObj ({ info, timeLeftS, callback }) {
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