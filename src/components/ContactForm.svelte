<script lang="ts">
    import { tick } from "svelte";
    import { Turnstile } from 'svelte-turnstile';

    let success: boolean = false;
    let loading: boolean = false;
    let hidden: boolean = true;
    let msg: string | null = null;
    let form: HTMLFormElement | null = null;

    async function submit(e: SubmitEvent) {
        if (form == null) {
            return;
        }

        loading = true;
        e.preventDefault();
        
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify({
            ...object,
            type: "contact"
        });

        try {
            const response = await fetch("https://infinitysupport.heathcotetech.com.au/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: json
            });

            const result = await response.json();
            if (response.status === 200) {
                success = true;
                msg = "Your message has been sent!"
            } else {
                success = false;
                msg = result.message || "Something went wrong when trying to send a message...";
            }

            hidden = false;
        } catch (error) {
            success = false;
            hidden = false;
            msg = "Something went wrong when trying to send a message...";
        }

        if (success) {
            form.reset();
        }

        await tick();

        setTimeout(() => {
            loading = false;
            success = false;
            hidden = true;
            msg = null;
        }, 2500);
    }
</script>

<div class="flex w-full justify-center flex-col m-5">
    <div class="{hidden ? 'hidden' : ''} toast toast-top toast-start z-10">
        <div class="alert {success ? 'alert-success' : 'alert-error'}">
            <span>{msg}</span>
        </div>
    </div>
    <form bind:this={form} on:submit={submit} id="contactForm" class="flex flex-col justify-center items-center">
        <div class="flex flex-col gap-2 text-left w-full m-5">
            <label class="text-xl text-[#116089] font-semibold" for="name">Name</label>
            <input class="input validator w-full" type="text" id="name" name="name" placeholder="Name" required />
        </div>
        <div class="flex flex-col gap-2 text-left w-full m-5">
            <label class="text-xl text-[#116089] font-semibold" for="email">Email</label>
            <input class="input validator w-full" type="email" id="email" name="email" placeholder="Email" required />
        </div>
        <div class="flex flex-col gap-2 text-left w-full m-5">
            <label class="text-xl text-[#116089] w-full font-semibold" for="phone">Phone</label>
            <input class="input validator w-full" type="text" id="phone" name="phone" placeholder="Phone" required />
        </div>
        <div class="flex flex-col gap-2 text-left w-full m-5">
            <label class="text-xl text-[#116089] font-semibold" for="message">Message</label>
            <textarea class="input validator w-full h-40 p-2" id="message" name="message" placeholder="Message" required></textarea>
        </div>
        <Turnstile siteKey="0x4AAAAAABjhcncBzAZebAHX" class="m-3" />
        <button class="btn btn-md bg-[#6cab38] text-white w-2/3" type="submit"><span class="{loading ? 'loading loading-dots loading-md' : ''}"></span>{loading ? '' : 'Submit'}</button>
    </form>
</div>