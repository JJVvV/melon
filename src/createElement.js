import events from './events'
import {isUndefined, isString, isNumber, isFunction, isNull, isNative, isThunk, isText, isSameThunk} from './common'
import {setAttribute} from "./attribute"
/**
 * vnode -> dom
 * @param vnode
 */
export function createElement(vnode){
    switch(vnode.type){
        case 'text':
            return createTextNode(vnode.nodeValue)
        case 'thunk':
            return createThunk(vnode)
        case 'empty':
            return createEmptyHTMLElement()
        case 'native':
            return createHTMLElement(vnode)
    }
}



/**
 * 生成文本节点
 * @param text 节点值
 * @returns {Text}
 */
function createTextNode(text){
    let value = isString(text) || isNumber(text) ? text : ''
    return document.createTextNode(value)
}

/**
 * thunk => real node
 * @param vnode
 */
function createThunk(vnode){
    let {props, children} = vnode
    let {onCreate} = vnode.options
    let model = {
        children,
        props
    }

    let output = vnode.fn(model)
    let DOMElement = createElement(output)
    if(onCreate) onCreate(model)
    vnode.state = {
        vnode: output,
        model
    }
    return DOMElement
}

function createHTMLElement(vnode){
    let {tagName, attributes, children} = vnode
    let DOMElement = document.createElement(vnode.tagName)
    for(let k in attributes){
        setAttribute(DOMElement, k, attributes[k])
    }
    children.forEach((node, index) => {
        if(isNull(node) || isUndefined(node)) return
        let child = createElement(node)
        DOMElement.appendChild(child)
    })

    return DOMElement
}


/**
 * 生成空dom
 * @returns {Element}
 */
function createEmptyHTMLElement(){
    return document.createElement('noscript')
}


