<script>

	import { page } from "$app/state";

	import Header from "$lib/components/Header.svelte";

	import Footer from "$lib/components/Footer.svelte";

	let { children } = $props();

	// const baseTitle = 'Mukesh Aryal';

	// const baseDescription = "Hi! I am Mukesh Aryal. I am a writer juggling between blog posts and code! This is my website where I share what I'm upto these days.";

	// const finalTitle = $derived( page.data.title ? page.data.title : baseTitle );

	// const finalDescription = $derived( page.data.description ? page.data.description : baseDescription );


</script>

<svelte:head>

    <title> {page.data.title} </title>

	<meta name="description" content={page.data.description}>

</svelte:head>

<Header />

{@render children?.()}

<Footer />
