import { pagination, active } from './Pagination.module.scss'
import { createShortcut } from "~/lib/shortcuts";
import { useNavigate } from 'solid-app-router';


export default function Pagination(props: { id: number }) {
    let id = () => 3 > props.id ? 3 : props.id
    const isActive = (i) => i == props.id ? active : '' 
    const navigate = useNavigate()
    
    createShortcut(['ArrowLeft'],() => navigate(`../${props.id - 1}`,{scroll: true}))
    createShortcut(['ArrowRight'],() => navigate(`../${props.id + 1}`,{scroll: true}))
    
    return (<div class={pagination}>
        <a class={isActive(id() - 2)} href={`./${id() - 2}`}>{id() - 2}</a>
        <a class={isActive(id() - 1)} href={`./${id() - 1}`}>{id() - 1}</a>
        <a class={isActive(id())} href={`./${id()}`}>{id()}</a>
        <a href={`./${id() + 1}`}>{id() + 1}</a>
        <a href={`./${id() + 2}`}>{id() + 2}</a>
    </div>)
}