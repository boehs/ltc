export default function RenderError(props: { error: Error } ) {
    return (<>
        <h2>Oh No! Something went wrong!</h2>
        <p><b>{props.error.name}:</b> {props.error.message}</p>
    </>)
}