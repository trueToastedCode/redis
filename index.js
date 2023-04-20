import { createClient } from 'redis'

import makeBuildMakeCache from './base-cache-access'

export default makeBuildMakeCache({ createClient })