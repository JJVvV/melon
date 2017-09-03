import {isUndefined, isString, isNumber,  isNull} from './common'

export function create(type, attributes, ...children){
    if(!type) throw new TypeError('element() needs a type.')
    attributes = attributes || {}
    children = Array.prototype.reduce.call(children || [], reduceChildren, [])

    if(typeof type === 'object'){
        return createThunkElement(type.render, attributes, children, type)
    }

    if(typeof type === 'function'){
        return createThunkElement(type, attributes, children, type)
    }

    return {
        type: 'native',
        tagName: type,
        attributes,
        children,
    }
}

/**
 * 生成vdom 对象
 * @param fn render 函数
 * @param props
 * @param children
 * @returns {{type: string, fn: *, attributes: *, children: *}}
 */
function createThunkElement(fn, props, children, options){
    return {
        type: 'thunk',
        fn,
        props,
        children,
        options
    }
}

function createTextElement(text){
    return {
        type: 'text',
        nodeValue: text
    }
}

function createEmptyElement(){
    return {
        type: 'empty'
    }
}

function reduceChildren(children, vnode){
    if(isString(vnode) || isNumber(vnode)) {
        children.push(createTextElement(vnode))
    }else if(isNull(vnode) || isUndefined(vnode)){
        children.push(createEmptyElement())
    }else if(Array.isArray(vnode)){
        children = [...children, ...vnode.reduce(reduceChildren, [])]
    }else {
        children.push(vnode)
    }

    return children
}


