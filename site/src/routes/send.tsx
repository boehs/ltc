import { activeStateListener } from "~/lib/shortcuts";

export default function Send() {
    return (<>
        <p>Write your letter!</p>
        <form class="disabled">
            <label for="message">Letter Message:</label>
            <textarea rows="1" name='message' onInput={(e) => {
                activeStateListener(e)
                const target = e.target as HTMLTextAreaElement
                target.style.height = "1px";
                const height = target.scrollHeight + 2
                target.style.height = (height > 192 ? 192 : height) + "px";
            }}></textarea>
            <label for="email">Email</label>
            <input type="email"/>
            <small>Email is optional and never shown. Leave yours if you want email notifications on new comments for this letter.</small>
            <input type='submit' value="Send 💌"></input>
        </form>
    </>)
}