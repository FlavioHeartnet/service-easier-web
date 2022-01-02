import { Message } from "semantic-ui-react";

export default function Messages(props){
    return (
        <>
        <Message
            success = {props.success}
            error = {props.error}
            header = {props.header}
            content = {props.content}
            hidden = {props.hidden}
        />
        </>
    )
}