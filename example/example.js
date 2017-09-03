
import {create} from '../src/create'
import createApp from '../src/createApp'
let count = 0;

let addCount = ()=> {
    count++
    app()
}
let render = createApp(document.body)


let app = () => {
    render(<Wrapper name="wrapper">hello world!</Wrapper>);
}

let Inner = {
    render: () => <span>我是inner</span>,
    onRemove: () => {
        console.log('removed')
    },
    onCreate: () => {
        console.log('created')
    }
}


let MyButton = {
    render: ({children, props}) => <button {...props}>{children}---{props.name}</button>,
    onCreate: () => {
        console.log('created')
    },
    onRemove: () => {
        console.log('removed')
    }
}
let Wrapper = {
    render: ({props, children}) => {
        return <div className={'wrapper'+count} onClick={addCount}>
            {count%2?<MyButton {...props}>{children}</MyButton>:'偶数'}

        </div>
    },

    onCreate: () => {
        console.log('wrapper')
    }
}

app()
