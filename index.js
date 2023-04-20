import { createClient } from 'redis'

import buildMakeCache from './base-cache-access'

export default buildMakeCache({ createClient })