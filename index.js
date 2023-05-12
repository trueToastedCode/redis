import findFirstOfKeys from '../find-first-of-keys'
import CustomError from '../custom-error'

import buildMakeDefaultCacheFunctions from './default-cache-functions'

export default buildMakeDefaultCacheFunctions({ findFirstOfKeys, CustomError })