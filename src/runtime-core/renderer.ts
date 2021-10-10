import { visitNode } from "typescript"
import { isObject } from "../shared"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode: any, container: any) {
    patch(vnode, container)
}

function patch(vnode: any, container: any) {
    console.log('vnode', vnode.type)
    if(typeof vnode.type === 'string') {
        processElement(vnode, container)
    } else if(isObject(vnode.type)) {
        processComponent(vnode, container)
    }
}

function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container)
}
function mountComponent(vnode: any, container) {
    const instance = createComponentInstance(vnode)
    setupComponent(instance)
    setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance:  any, vnode, container) {
    const subTree = instance.render
    patch(subTree, container)
    vnode.el = subTree.el
}

function processElement(vnode: any, container: any) {
    mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
    const el = (vnode.el = document.createElement(vnode.type))
    const {children} = vnode
    if(typeof children === 'string') {
        el.textContent = children
    } else if(Array.isArray(children)) {
        mountChildren(vnode, el)
    }
    const { props } = vnode
    for(const key in props) {
        const val = props[key]
        el.setAttribute(key, val)
    }
    container.append(el)
}

function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
        patch(v, container)
    })
}
