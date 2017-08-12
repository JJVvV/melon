
import {create} from '../src/create'
import createApp from '../src/createApp'
let count = 0;

let addCount = ()=> {
    count++
    app()
}
let render = createApp(document.body)


let app = () => {
    render(<Wrapper>hello world!</Wrapper>);
}

let MyButton = {
    render: ({children, props}) => <button {...props}>{children}---{props.name}</button>
}
let Wrapper = {
    render: ({props, children}) => {
        return <div className={'wrapper'+count} onClick={addCount}>
            <span>{children}:{count}</span>
        </div>
    }
}

app()
