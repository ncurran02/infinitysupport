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
        const file = formData.get('attachment') as File | null;
        
        const object = Object.fromEntries(formData);

        let fileAttachment = null;
        if (file && file.size > 0) {
            const base64 = await readFileAsBase64(file);
            fileAttachment = {
                name: file.name,
                contentType: file.type,
                contentBytes: base64
            };
        }
        
        const json = JSON.stringify({
            ...object,
            type: "referral",
            attachment: fileAttachment
        });

        try {
            const response = await fetch("/api/contact", {
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
        }, 3000);
    }

    function readFileAsBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
</script>

<div class="flex w-full justify-center flex-col m-5">
    <div class="{hidden ? 'hidden' : ''} toast toast-top toast-start z-10">
        <div class="alert {success ? 'alert-success' : 'alert-error'}">
            <span>{msg}</span>
        </div>
    </div>
    <form bind:this={form} on:submit={submit} id="contactForm" class="flex flex-col justify-center items-center">
        <label class="text-xl text-[#116089] font-semibold" for="participant">Participant Details</label>
        <div id="participant" class="flex flex-col justify-center items-center w-full">
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="name">Name</label>
                <input class="input validator w-full" type="text" id="name" name="name" placeholder="Name" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="email">Email</label>
                <input class="input validator w-full" type="email" id="email" name="email" placeholder="Email" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="phone">Phone</label>
                <input class="input validator w-full" type="text" id="phone" name="phone" placeholder="Phone" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="dob">Date of Birth</label>
                <input class="input" type="date" id="dob" name="dob" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="disability">Primary Disability</label>
                <input class="input validator w-full" type="text" id="disability" name="disability" placeholder="Primary Disability" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="behaviour">Potential Risks/Behaviour Concerns</label>
                <textarea class="input validator w-full h-20 p-2" id="behaviour" name="behaviour" placeholder="Potential Risks/Behaviour Concerns"></textarea>
            </div>
        </div>
        <label class="text-xl text-[#116089] font-semibold" for="services">Services Required</label>
        <div id="services" class="gap-2 text-left m-5 w-[85%] flex lg:flex-row flex-col justify-between mx-auto">
            <div>
                <input class="w-12" type="checkbox" id="support" name="support" />
                <label class="text-lg text-[#116089]" for="support">Support Coordination</label>
            </div>
            <div>
                <input class="w-12" type="checkbox" id="community" name="community" />
                <label class="text-lg text-[#116089]" for="community">Community Access</label>
            </div>
            <div>
                <input class="w-12" type="checkbox" id="allied" name="allied" />
                <label class="text-lg text-[#116089]" for="allied">Allied Health Assistants</label>
            </div>
            <div>
                <input class="w-12" type="checkbox" id="accomodation" name="accomodation" />
                <label class="text-lg text-[#116089]" for="accomodation">Accomodation</label>
            </div>
        </div>
        <input type="file" class="file-input file-input-neutral" id="file" name="attachment" />
        <Turnstile siteKey="0x4AAAAAABabC5nznMKeH-P_" class="m-3" />
        <button class="btn btn-md bg-[#6cab38] text-white w-1/2" type="submit"><span class="{loading ? 'loading loading-dots loading-md' : ''}"></span>{loading ? '' : 'Submit'}</button>
    </form>
</div>