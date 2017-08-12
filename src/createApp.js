import {createElement} from './createElement'
import {updateElement} from "./updateElement"

export default function createApp(container){
    let node,
        oldNode

    if(container) container.innerHTML = ''

    function c(vnode){
        node = createElement(vnode)
        container.appendChild(node)
        oldNode = vnode
        return node
    }

    function u(vnode){
        updateElement(container, oldNode, vnode)
        oldNode = vnode
    }

    return (vnode) => {
        return node ? u(vnode) : c(vnode)
    }
}