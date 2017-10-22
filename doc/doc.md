

通过实现一个短小的virtual dom，了解virtual dom的原理，进而加深对React的理解。





今天要实现的功能如下：

````
//定义一个组件
let MyButton = {
	render: ({props, children}) =>
		<button onClick={addCount} {...props}>{children}{count}</button>
}
let count = 0
let addCount = () => {
	count++
	app()
}
//渲染函数，用来生成dom
let render = createApp(document.body)

let app = () => {
	render(<MyButton className="button">hello, button</MyButton>)
}

app()
````
看起来是不是很像react？

1. 支持自定义组价（组件可互相嵌套）
2. 事件
3. 支持attribute
4. 组件的diff更新


下面我们来一步步实现这些功能。

使用过jsx的同学对它肯定很喜欢

````js
const wrapper = (
	<div className="wrapper">
		<span>hello</span>
		<span> world!</span>
	</div>
)

````
如果想使用jsx语法，我们可以借助于babel。babel在解析jsx的时候需要指定一个函数，如果你写过react的话，那默认是React.createElement函数。这里我们这里定义一个函数create:

````
function create(type, attributes, ...children){
	return {
		type,
		props: attributes,
		children
	}
}

````
有个这个函数wrapper， babel在解析wrapper的时候会依次传入type、attributes、child1、child2....

下边的写法完全等价于上边的jsx语法：

````
const wrapper = create('div', {className:'wrapper'},
	create('span', {}, 'hello'),
	create('span', {}, 'world!')
)

````

创建
=====

现在我们需要把wrapper转换为真正的dom，我们定义一个方法createElement:

````
/***
*	将vnode转换为dom
* 	@param {Object} vnode - 虚拟dom
*  @return {Node}  - dom
*/
function createElement(vnode){
	return document.createElement(vnode.type)
}
````

createElement方法会将vnode转换为真实的dom，但是目前这个方法只能处理Element类型的元素，文本元素都无法处理。我们先看下有多少个类型需要处理。

1. Element类型（native）
2. Text类型（text）
3. 自定义组件类型， 如MyButton（thunk）
4. 空类型（empty）在react中会生成noscript。{undefined}就会生成一个空类型，空类型的作用在与站位，便于diff算法优化。

所以我们来改写下createElement：

````
/***
*	将vnode转换为dom
* 	@param {Object} vnode - 虚拟dom
*  @return {Node}  - dom
*/
function createElement(vnode){
	switch(vnode.type){
		case 'text':
			//文本类型
			return createTextNode(vnode.nodeValue)
		case 'thunk':
			//自定义组件类型
			return createThunk(vnode)
		case 'empty':
			//空类型
          return createEmptyHTMLElement()
		case 'native':
			return createHTMLElement(vnode)
	}
}

````
写到这里，可能有些人会不知道vnode和vnode的type属性从哪里来的，这里我们回过头来重写下create函数：

````
function create(type, attributes, ...children){
	f(!type) throw new TypeError('element() needs a type.')
    attributes = attributes || {}
    //处理子元素, 包括对Text类型的处理
    children = Array.prototype.reduce.call(children || [], reduceChildren, [])

	 //处理自定义组件
    if(typeof type === 'object'){

        return return {
	        type: 'thunk',
	        fn: type.fn,
	        props:attributes,
	        children
	    }
    }

	//处理Element类型
    return {
        type: 'native',
        tagName: type,
        attributes,
        children,
    }
}

/**
* 处理子元素
* @param {Array} children=[]
* @param {Object} vnode
* @return {Array} children 经过转换的vnode数组
*/
function reduceChildren(children, vnode){
    if(isString(vnode) || isNumber(vnode)) {
    	 //{type: 'text'}
        children.push(createTextElement(vnode))
    }else if(isNull(vnode) || isUndefined(vnode)){
        children.push(createEmptyElement())
    }else if(Array.isArray(vnode)){
    	 //处理{children}
        children = [...children, ...vnode.reduce(reduceChildren, [])]
    }else {
        children.push(vnode)
    }

    return children
}

````

更新
======

dom创建完成之后，就需要更新dom操作了。其实dom的更新可以抽象出一下几点

1. 添加（appendChild），增加了新的元素
2. 删除 (removeChild)，删除了元素
3. 取代 (replaceChild)，元素类型不同时元素取代
4. 更新（diffAttribute, diffChildren），元素类型相同，则比较attribute和children

```
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
```


参考文献：

* [deku 一个短小的类似react的表现层实现](https://github.com/anthonyshort/deku)
* [decca](https://github.com/rstacruz/decca)
* [how-to-write-your-own-virtual-dom](https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060)
