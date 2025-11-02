<script>
  import { onMount } from "svelte";

  let pings = $state([]);

  onMount(() => {
    const eventSource = new EventSource("/api/pings/stream");

    eventSource.onmessage = (event) => {
      pings = [/* ...pings, */ event.data];
    };

    return () => {
      eventSource.close();
    };
  });
</script>

{#if pings.length === 0}
  <p>No pings yet.</p>
{:else}
  <ul>
    {#each pings as ping, index}
      <li>{ping}</li>
    {/each}
  </ul>
{/if}