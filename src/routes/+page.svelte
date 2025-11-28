<script>
    import Avatar from "$lib/components/Avatar.svelte";

    import BlogCard from "$lib/components/BlogCard.svelte";

    import { LinkHandler, posts } from "$lib";

    // const { url, title, date, hero, alt, description } = posts[posts.length - 1];

</script>

<main class="main">

    <header class="intro" data-nosnippet>

        <Avatar />

        <h1>
        Hi! I am Mukesh Aryal.
        </h1>

        <h2>
            I am a <span class="writer">writer</span>
        </h2>

        <h2 class="second-line">
            These days, I write mostly 
        </h2>

        <div class="code-container">

            <div class="code">
                <code class="code-word">code</code>

                <ul class="suggestions" aria-hidden="true">
                    <li class="selected">abc<span class="highlight"><code>code</code></span></li>
                    <li>abc<code><span class="highlight">code</span>r</code></li>
                    <li>abc<code><span class="highlight">c</span>reate<span class="highlight">O</span>r<span class="highlight">de</span>r</code></li>
                </ul>
            </div>
        </div>

    </header>


    <section class="blog-section">

        <h1>
            Read my recent blog posts
        </h1>

        <div class="blogs-container">

            {#each posts as post}

                <a class="blog" href={LinkHandler(`/blog/${post.url}`)}>

                    <figure>

                        <img src={LinkHandler(post.hero)} alt={post.alt} />

                        <figcaption>

                            { post.title }
                        </figcaption>


                    </figure>

                    <div class="blog-post-description">

                        <p class="description">
                            { post.description }
                        </p>

                        <p class="date">
                            Written on <strong> { post.date } </strong>
                        </p>
                    </div>      
                
                </a>
            {/each}

        </div>
    </section>

</main>



<style>

    @keyframes blink{
        from{
            opacity: 0;
        }

        to{
            opacity: 1;
        }
    }

    .main{
        padding: 1rem;
    }

    .intro{
        text-align: center;
        margin-bottom: 2rem;
    }

    .intro h1{
        font-size: clamp(2.4rem, 5vw, 5rem);
    }

    .intro h2{
        font-size: clamp(2rem, 4vw, 4rem);
    }

    .intro .second-line{
        margin-bottom: 0;
    }

    .code-container{
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 4rem;
    }

    .code{
        position: relative;
        width: fit-content;
    }

    .code code{
        font-size: clamp(1.6rem, 3vw, 3rem);
        font-weight: bold;
    }

    .writer{
        color: #ff6600;
    }

    .code-word{
        color: #0099ff;
    }

    .writer::after{
        content: '❙';
        animation: blink 600ms ease-in-out alternate infinite;
    }

    .code-word::after{
        content: '❘';
    }

    .suggestions{
        list-style: none;
        position: absolute;
        margin: 0;
        padding-inline-start: 0;
        text-align: left;
        border: 2px solid #D6DEDF88;
        top: 100%;
        left: 100%;
        background-color: var(--primary-background);
    }

    .suggestions .highlight{
        color: #0099ff;
    }

    .selected{
        background-color: var(--secondary-background);
    }

    .suggestions li{
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: min(2.5vw, 1rem);
        padding: min(1vw, 0.2rem);
        font-size: min(2vw, 0.8rem);
        line-height: 1;
    }

    .suggestions li:hover{
        background-color: var(--secondary-background);
    }

    .suggestions li code{
        font-size: min(3vw, 1.5rem);
    }


    .blogs-container{
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .blogs-container a{
        text-decoration: none;
        color: inherit;
    }

    .blog{
        background-color: var(--secondary-background);
        display: flex;
        justify-content: space-between;
        gap: 1.5rem;
        padding: 1rem;
        width: 40vw;
        border-radius: 0.5rem;
    }

    .blog-post-description{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
    }

    .blog figure{
        margin: 0;
        font-size: 1.5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
    }

    .blog figure img{
        width: 10rem;
        height: 10rem;
    }

    .blog p{
        text-align: justify;
        line-height: 1.5;
        font-size: 1rem;
        margin: 0;
    }

    @media (max-width: 1000px)
    {
        .blogs-container{
            flex-direction: column;
        }

        .blog{
            width: unset;
            flex-direction: column;
        }

        .blog figure{
            align-items: center;
        }
    }


</style>

