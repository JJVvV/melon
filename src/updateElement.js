import {createElement} from './createElement'
import {isUndefined, isString, isNumber, isFunction, isNull, isNative, isThunk, isText, isSameThunk} from './common'
import {setAttribute, removeAttribute} from "./attribute"
/**
 * 更新node
 * @param node -dom node,  parent node of vdom
 * @param pre  -pre vnode
 * @param next -next vnode
 * @param index - child index in parent
 * @returns node
 */
export function updateElement(node, pre, next, index=0){

    if(pre === next) return node

    if(!isUndefined(pre) && isUndefined(next)){
        return removeNode(node, pre, next, index)
    }

    if(isUndefined(pre) && !isUndefined(next)){
        node.appendChild(createElement(next))
        return node;
    }

    if(!isNull(pre) && isNull(next) || isNull(pre) && !isNull(next)){
        return replaceNode(node, pre, next, index)
    }

    if(pre.type!==next.type){
        return replaceNode(node, pre, next, index)
    }

    if(isNative(next)){
        if(pre.tagName !== next.tagName){
            return replaceNode(node, pre, next, index)
        }
        diffAttributes(node, pre, next, index)
        return diffChildren(node, pre, next, index)
    }

    if(isText(next)){
        if(pre.nodeValue !== next.nodeValue){
            node.childNodes[index].nodeValue = next.nodeValue
        }
        return node
    }

    if(isThunk(next)){
        if(isSameThunk(pre, next)){
            return updateThunk(node, pre, next, index)
        }else {
            return replaceThunk(node, pre, next, index)
        }
    }
}

/**
 * 删除节点
 * @param node
 * @param pre
 * @param next
 * @param index
 */
function removeNode(node, pre, next, index){
    removeThunk(pre)
    node.removeChild(node.childNodes[index])
}

/**
 * replace节点
 * @param node
 * @param pre
 * @param next
 * @param index
 */
function replaceNode(node, pre, next, index){
    let newNode = createElement(next)
    removeThunk(pre)
    node.replaceChild(newNode, node.childNodes[index])
    return newNode
}

/**
 * thunk元素销毁时处理onRemove
 * @param vnode
 */
function removeThunk(vnode){
    while(isThunk(vnode)){
        let {onRemove} = vnode.options
        let {model} = vnode.state
        if(onRemove) onRemove(model)
        vnode = vnode.state.vnode
    }
    if(vnode.children){
        vnode.children.forEach(removeThunk)
    }
}

/**
 * 更新attribute
 * @param node
 * @param pre
 * @param next
 * @param index
 */
function diffAttributes(node, pre, next, index){
    let k,
        child = node.childNodes[index],
        preAttributes = pre.attributes,
        nextAttributes = next.attributes
    for(k in preAttributes){
        if(!(k in nextAttributes)){
            removeAttribute(child, k, preAttributes[k])
        }
    }
    for(k in nextAttributes){
        if(nextAttributes[k] !== preAttributes[k]){
            setAttribute(child, k, nextAttributes[k])
        }
    }
}

/**
 * 更新子节点
 * @param node
 * @param pre
 * @param next
 * @param index
 */
function diffChildren(node, pre, next, index){
    let preChildren = pre.children || [],
        nextChildren = next.children || [],
        i,
        nodeChildren = Array.prototype.slice.call(node.children)

    for(i=0; i<preChildren.length||i<nextChildren.length; i++){
        updateElement(nodeChildren[index], preChildren[i], nextChildren[i], i)
    }

    return node
}

/**
* 更新thunk
*/
function updateThunk(node, pre, next, index){
    let {props, children} = next
    let model = {
        children,
        props,
    }
    let nextNode = next.fn(model)

    updateElement(node, pre.state.vnode, nextNode)
    next.state = {
        vnode: nextNode,
        model
    }
    return node
}