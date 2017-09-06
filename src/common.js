const isType = (type) => (value) => typeof value === type
const isVType = (type) => (vnode) => vnode.type === type
export const isUndefined = isType('undefined')
export const isString = isType('string')
export const isNumber = isType('number')
export const isFunction = isType('function')
export const isNull = (value) => value === null
export const isNative = isVType('native')
export const isThunk = isVType('thunk')
export const isText = isVType('text')
export const isSameThunk = (pre, next) => pre.fn === next.fn