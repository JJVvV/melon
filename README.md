Melon
=========================




这个项目的目的是通过自己实现一个virtual-dom，有助于更好的理解React这类库的底层原理，不建议运用到实际项目当中。

## Installation

```
npm install

npm start

```
open localhost:3003


## Example

```
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
```

## Thanks

这里的大部分代码都是参考这里：

* [deku 一个短小的类似react的表现层实现](https://github.com/anthonyshort/deku)  
* [decca](https://github.com/rstacruz/decca)    
* [how-to-write-your-own-virtual-dom](https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060)


## License

MIT