export default function buildMakeCache ({ createClient }) {
  const client = createClient({ url })
  const connectionPromise = client.connect()
  return function makeCache () {
    return connectionPromise
  }
}