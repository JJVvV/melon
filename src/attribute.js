import events from './events'
import {isFunction} from './common'
/**
 * 设置dom attribute
 * @param node dom
 * @param key  attribute key
 * @param value attribue value
 * @param previousValue attribue previous value
 */
export function setAttribute(node, key, value, previousValue){
    let eventName = events[key]
    if(value === previousValue) return
    if(eventName){
        if(isFunction(previousValue)){
            node.removeEventListener(eventName, previousValue)
        }
        node.addEventListener(eventName, value)
        return
    }

    switch (key) {
        case 'checked':
        case 'disabled':
        case 'innerHTML':
        case 'nodeValue':
            node[key] = value
            break
        case 'className':
            node.setAttribute('class', value)
            break;
        default:
            node.setAttribute(key, value)
            break
    }

}

/**
 * 删除attribute
 * @param node
 * @param key
 * @param previousValue
 */
export function removeAttribute(node, key, previousValue){
    let eventName = events[key]
    if(eventName){
        node.removeEventListener(eventName, previousValue)
        return
    }

    switch (name) {
        case 'checked':
        case 'disabled':
        case 'innerHTML':
        case 'nodeValue':
            node[key] = false
            break
        case 'className':
            node.removeAttribute('class')
            break;
        default:
            node.removeAttribute(key)
            break
    }
}