<script>
  import { LinkHandler, posts } from "$lib";
</script>

<h1>Blog Posts</h1>
<ul>
  {#each posts as post}
    <li><a href={LinkHandler(`/blog/${post.url}`)}>{post.title}</a></li>
  {/each}

  

  
</ul>
