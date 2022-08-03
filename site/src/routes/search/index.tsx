import { useRouteData, Title } from "solid-start";
import { createSignal } from "solid-js";
import { createRouteAction } from "solid-start/data";
import { redirect } from "solid-start/server";
import { activeStateListener } from "~/lib/shortcuts";

export function routeData() {
    return createRouteAction(async (formData: FormData) => {
        return redirect(`/search/${encodeURI(formData.get('ss') as string)}/1`)
    })
}

export default function Search() {
    const data: ReturnType<typeof routeData> = useRouteData()
    const [isLoading, setIsLoading] = createSignal(false)

    return (<>
        <Title>Search...</Title>
        <data.Form onsubmit={() => setIsLoading(true)}>
            <label for="ss">What are you looking for?</label>
            <input name="ss" type="text" placeholder="Search..." onInput={activeStateListener} />
            <input type="submit" disabled={isLoading()} />
        </data.Form>
    </>)
}