<script>

	import { page } from "$app/state";

	import Header from "$lib/components/Header.svelte";

	import Footer from "$lib/components/Footer.svelte";

	let { children } = $props();


</script>

<svelte:head>

    <title> {page.data.title} </title>

	<meta name="description" content={page.data.description}>

</svelte:head>

<Header />

{@render children?.()}

<Footer />
