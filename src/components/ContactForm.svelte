<script lang="ts">
    import { Turnstile } from 'svelte-turnstile';
</script>

<div class="flex w-full justify-center flex-col m-5">
    <form action="#" method="post">
        <div class="flex flex-col gap-2 text-left m-5">
            <label class="text-xl text-[#116089] font-semibold" for="name">Name</label>
            <input class="input validator w-full" type="text" id="name" name="name" placeholder="Name" required />
        </div>
        <div class="flex flex-col gap-2 text-left m-5">
            <label class="text-xl text-[#116089] font-semibold" for="email">Email</label>
            <input class="input validator w-full" type="email" id="email" name="email" placeholder="Email" required />
        </div>
        <div class="flex flex-col gap-2 text-left m-5">
            <label class="text-xl text-[#116089] font-semibold" for="phone">Phone</label>
            <input class="input validator w-full" type="text" id="phone" name="phone" placeholder="Phone" required />
        </div>
        <div class="flex flex-col gap-2 text-left m-5">
            <label class="text-xl text-[#116089] font-semibold" for="message">Message</label>
            <textarea class="input validator w-full h-20 p-2" id="message" name="message" placeholder="Message" required></textarea>
        </div>
        <Turnstile siteKey="0x4AAAAAABabC5nznMKeH-P_" class="m-3" />
        <button class="btn btn-md bg-[#116089] text-white w-1/2" type="submit">Submit</button>
    </form>
</div>