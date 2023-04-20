export default function makeBuildMakeCache ({ createClient }) {
  return function buildMakeCache ({ url }) {
    const client = createClient({ url })
    const connectionPromise = client.connect()
    return async function makeCache () {
      await connectionPromise
      return client
    }
  }
}