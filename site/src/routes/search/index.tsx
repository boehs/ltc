import { useRouteData } from "solid-app-router";
import { createSignal } from "solid-js";
import { createServerAction, redirect } from "solid-start/server";

export function routeData() {
    return createServerAction(async (formData: FormData) => {
        // @ts-expect-error
        return redirect(`./search/${encodeURI(formData.get('ss'))}/1`)
    })
}

export default function Search() {
    const data: ReturnType<typeof routeData> = useRouteData()
    const [isLoading, setIsLoading] = createSignal(false)
    
    return <main>
        <data.Form onsubmit={() => setIsLoading(true)}>
            <label for="ss">What are you looking for?</label>
            <input name="ss" type="text" placeholder="Search..."/>
            <input type="submit" disabled={isLoading()} />
        </data.Form>
    </main>
}