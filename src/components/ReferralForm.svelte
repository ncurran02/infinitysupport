<script lang="ts">
    import { tick } from "svelte";
    import { Turnstile } from 'svelte-turnstile';

    let success: boolean = false;
    let loading: boolean = false;
    let hidden: boolean = true;
    let msg: string | null = null;
    let form: HTMLFormElement | null = null;

    let formData = {
        participant: {
            name: "",
            email: "",
            phone: "",
            dob: "",
            disability: "",
            behaviour: ""
        },
        services: {
            support: false,
            community: false,
            allied: false,
            accomodation: false
        },
        coordinator: {
            name: "",
            email: "",
            phone: "",
            company: ""
        },
        plan: {
            name: "",
            email: "",
            type: "",
        },
        ndis: {
            ndisNumber: "",
            startDate: "",
            endDate: ""
        },
        days: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false
        }
    }

    async function submit(e: SubmitEvent) {
        if (form == null) {
            return;
        }

        loading = true;
        e.preventDefault();

        const fd = new FormData(form);

        const input = document.getElementById('file') as HTMLInputElement;
        let fileAttachments = [];
        if (input && input.files && input.files.length > 0) {
            for (const file of input.files) {
                const base64 = await readFileAsBase64(file);
                fileAttachments.push({
                    name: file.name,
                    contentType: file.type,
                    contentBytes: base64
                });
            }
        }

        const json = JSON.stringify({
            ...formData,
            type: "referral",
            attachments: fileAttachments,
            'cf-turnstile-response': fd.get('cf-turnstile-response')
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
        <label class="text-2xl text-[#116089] font-semibold text-center" for="participant">Participant Details</label>
        <div id="participant" class="flex flex-col justify-center items-center w-full">
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="name">Name</label>
                <input bind:value={formData.participant.name} class="input validator w-full" type="text" id="name" name="name" placeholder="Name" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="email">Email</label>
                <input bind:value={formData.participant.email} class="input validator w-full" type="email" id="email" name="email" placeholder="Email" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="phone">Phone</label>
                <input bind:value={formData.participant.phone} class="input validator w-full" type="text" id="phone" name="phone" placeholder="Phone" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="dob">Date of Birth</label>
                <input bind:value={formData.participant.dob} class="input validator" type="date" id="dob" name="dob" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="disability">Primary Disability</label>
                <input bind:value={formData.participant.disability} class="input validator w-full" type="text" id="disability" name="disability" placeholder="Primary Disability" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="behaviour">Potential Risks/Behaviour Concerns</label>
                <textarea bind:value={formData.participant.behaviour} class="input validator w-full h-20 p-2" id="behaviour" name="behaviour" placeholder="Potential Risks/Behaviour Concerns"></textarea>
            </div>
        </div>
        <label class="text-2xl text-[#116089] font-semibold mt-10 text-center" for="services">Services Required</label>
        <div id="services" class="gap-2 text-left m-5 w-[85%] flex lg:flex-row flex-col justify-between lg:items-center items-start mx-auto">
            <div class="flex flex-row justify-center items-center mx-5">
                <input bind:checked={formData.services.support} class="checkbox checked:bg-[#6cab38] checked:text-white m-3" type="checkbox" id="support" name="support" />
                <label class="text-lg text-[#116089]" for="support">Support Coordination</label>
            </div>
            <div class="flex flex-row justify-center items-center mx-5">
                <input bind:checked={formData.services.community} class="checkbox checked:bg-[#6cab38] checked:text-white m-3" type="checkbox" id="community" name="community" />
                <label class="text-lg text-[#116089]" for="community">Community Access</label>
            </div>
            <div class="flex flex-row justify-center items-center mx-5">
                <input bind:checked={formData.services.allied} class="checkbox checked:bg-[#6cab38] checked:text-white m-3" type="checkbox" id="allied" name="allied" />
                <label class="text-lg text-[#116089]" for="allied">Allied Health Assistants</label>
            </div>
            <div class="flex flex-row justify-center items-center mx-5">
                <input bind:checked={formData.services.accomodation} class="checkbox checked:bg-[#6cab38] checked:text-white m-3" type="checkbox" id="accomodation" name="accomodation" />
                <label class="text-lg text-[#116089]" for="accomodation">Accomodation</label>
            </div>
        </div>
        <label class="text-2xl text-[#116089] font-semibold mt-10 text-center" for="coordinator">Support Coordinator/LAC/Referring Practitioner</label>
        <div id="coordinator" class="flex flex-col justify-center items-center w-full">
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="coordname">Name</label>
                <input bind:value={formData.coordinator.name} class="input validator w-full" type="text" id="coordname" name="coordname" placeholder="Name" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="coordemail">Email</label>
                <input bind:value={formData.coordinator.email} class="input validator w-full" type="email" id="coordemail" name="coordemail" placeholder="Email" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="coordphone">Phone</label>
                <input bind:value={formData.coordinator.phone} class="input validator w-full" type="text" id="coordphone" name="coordphone" placeholder="Phone" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="coordcompany">Company</label>
                <input bind:value={formData.coordinator.company} class="input validator w-full" type="text" id="coordcompany" name="coordcompany" placeholder="Company" />
            </div>
        </div>
        <label class="text-2xl text-[#116089] font-semibold mt-10 text-center" for="plan">Plan Manager</label>
        <div id="plan" class="flex flex-col justify-center items-center w-full">
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="planname">Name</label>
                <input bind:value={formData.plan.name} class="input validator w-full" type="text" id="planname" name="planname" placeholder="Name" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="planemail">Email</label>
                <input bind:value={formData.plan.email} class="input validator w-full" type="email" id="planemail" name="planemail" placeholder="Email" required />
            </div>
            <div class="flex lg:flex-row flex-col justify-center items-center">
                <label class="text-xl text-[#116089] font-semibold" for="plantype">How is the plan managed?</label>
                <div id="plantype" class="flex lg:flex-row flex-col lg:my-0 my-2 lg:items-center items-start">
                    <div class="flex flex-row justify-center items-center mx-5">
                        <input bind:group={formData.plan.type} class="radio checked:bg-[#6cab38] checked:text-white m-2" type="radio" id="ndia" name="plantype-radio" value="ndia" required />
                        <label class="text-lg text-[#116089]" for="ndia">NDIA</label>
                    </div>
                    <div class="flex flex-row justify-center items-center mx-5">
                        <input bind:group={formData.plan.type} class="radio checked:bg-[#6cab38] checked:text-white m-2" type="radio" id="selfmanaged" name="plantype-radio" value="self-managed" />
                        <label class="text-lg text-[#116089]" for="selfmanaged">Self Managed</label>
                    </div>
                    <div class="flex flex-row justify-center items-center mx-5">
                        <input bind:group={formData.plan.type} class="radio checked:bg-[#6cab38] checked:text-white m-2" type="radio" id="planmanaged" name="plantype-radio" value="plan-managed" />
                        <label class="text-lg text-[#116089]" for="planmanaged">Plan Managed</label>
                    </div>
                </div>
            </div>
        </div>
        <label class="text-2xl text-[#116089] font-semibold mt-10 text-center" for="ndis">NDIS Details</label>
        <div id="ndis" class="flex flex-col justify-center items-center w-full">
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="number">Name</label>
                <input bind:value={formData.ndis.ndisNumber} class="input validator w-full" type="text" id="number" name="number" placeholder="NDIS Number" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="startdate">Start Date</label>
                <input bind:value={formData.ndis.startDate} class="input validator" type="date" id="startdate" name="startdate" required />
            </div>
            <div class="gap-2 text-left m-5 w-[85%] flex flex-col">
                <label class="text-xl text-[#116089] font-semibold" for="enddate">End Date</label>
                <input bind:value={formData.ndis.endDate} class="input validator" type="date" id="enddate" name="enddate" required />
            </div>
        </div>
        <label class="text-2xl text-[#116089] font-semibold mt-10 text-center" for="days">Preferred Support Days</label>
        <div id="days" class="gap-2 m-5 w-[90%] flex lg:flex-row flex-col lg:items-center justify-center items-start mx-auto">
            <div class="flex flex-row justify-center items-center mx-3">
                <input bind:checked={formData.days.sunday} class="checkbox checked:bg-[#6cab38] checked:text-white m-3" type="checkbox" id="sunday" name="sunday" />
                <label class="text-md text-[#116089]" for="sunday">Sunday</label>
            </div>
            <div class="flex flex-row justify-center items-center mx-3">
                <input bind:checked={formData.days.monday} class="checkbox checked:bg-[#6cab38] checked:text-white m-3" type="checkbox" id="monday" name="momday" />
                <label class="text-md text-[#116089]" for="monday">Monday</label>
            </div>
            <div class="flex flex-row justify-center items-center mx-3">
                <input bind:checked={formData.days.tuesday} class="checkbox checked:bg-[#6cab38] checked:text-white m-3" type="checkbox" id="tuesday" name="tuesday" />
                <label class="text-md text-[#116089]" for="tuesday">Tuesday</label>
            </div>
            <div class="flex flex-row justify-center items-center mx-3">
                <input bind:checked={formData.days.wednesday} class="checkbox checked:bg-[#6cab38] checked:text-white m-3" type="checkbox" id="wednesday" name="wednesday" />
                <label class="text-md text-[#116089]" for="wednesday">Wednesday</label>
            </div>
            <div class="flex flex-row justify-center items-center mx-3">
                <input bind:checked={formData.days.thursday} class="checkbox checked:bg-[#6cab38] checked:text-white m-3" type="checkbox" id="thursday" name="thursday" />
                <label class="text-md text-[#116089]" for="thursday">Thursday</label>
            </div>
            <div class="flex flex-row justify-center items-center mx-3">
                <input bind:checked={formData.days.friday} class="checkbox checked:bg-[#6cab38] checked:text-white m-3" type="checkbox" id="friday" name="friday" />
                <label class="text-md text-[#116089]" for="friday">Friday</label>
            </div>
            <div class="flex flex-row justify-center items-center mx-3">
                <input bind:checked={formData.days.saturday} class="checkbox checked:bg-[#6cab38] checked:text-white m-3" type="checkbox" id="saturday" name="saturday" />
                <label class="text-md text-[#116089]" for="saturday">Saturday</label>
            </div>
        </div>
        <input type="file" class="file-input file-input-neutral m-2 lg:w-1/3 w-1/2" id="file" name="attachment" multiple />
        <Turnstile siteKey="0x4AAAAAABabC5nznMKeH-P_" class="m-3" />
        <button class="btn btn-md bg-[#6cab38] hover:bg-[#6cab38]/85 text-white w-1/2" type="submit"><span class="{loading ? 'loading loading-dots loading-md' : ''}"></span>{loading ? '' : 'Submit'}</button>
    </form>
</div>