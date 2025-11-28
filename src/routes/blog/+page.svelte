<script>
	import { LinkHandler, posts } from "$lib";
</script>

<main class="main">

	<h1>Blog Posts</h1>

	<ol class="blogs-list">

		{#each posts as post}

			<li>
				<a href={LinkHandler(`/blog/${post.url}`)}>{post.title}</a>
			</li>

		{/each}
	</ol>
</main>

<style>

	.main{
		padding: 1rem;
	}

	.blogs-list a{
		color: inherit;
	}

	.blogs-list li{
		line-height: 1.5;
	}

</style>
