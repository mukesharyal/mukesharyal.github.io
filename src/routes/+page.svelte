<script>
    import Avatar from "$lib/components/Avatar.svelte";

    import BlogCard from "$lib/components/BlogCard.svelte";

    import { LinkHandler, posts } from "$lib";

    const { url, title, date, hero, alt, description } = posts[posts.length - 1];

</script>

<main class="main">

    <header class="intro">

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
            Read my most recent blogs
        </h1>

        <div class="blogs-container">

            <a class="blog" href={LinkHandler('/blog/{url}')}>

        
                <figure>

                    <img src={LinkHandler(hero)} alt={alt} />

                    <figcaption>

                        { title }
                    </figcaption>


                </figure>

                <div>
                    <p>
                        { description }
                    </p>

                    <p>
                        Written on { date }
                    </p>
                </div>

                    
             
            </a>

        </div>
    </section>



    <!-- <section class="blog">
        {#each data.posts as post}
            <BlogCard fileName={post} />
        {/each}
    </section> -->

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
    }

    .blogs-container a{
        text-decoration: none;
        color: inherit;
    }

    .blog{
        background-color: var(--secondary-background);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
        max-width: 40vw;
        border-radius: 0.5rem;
    }

    .blog figure{
        margin: 0;
        font-size: 1.25rem;
        text-align: center;
    }

    .blog figure img{
        max-width: 80%;
    }

    .blog p{
        text-align: justify;
    }

    @media (max-width: 1400px)
    {
        .blog{
            max-width: unset;
        }
    }

    @media (max-width: 600px)
    {
        .blog{
            flex-direction: column;
        }
    }



</style>

