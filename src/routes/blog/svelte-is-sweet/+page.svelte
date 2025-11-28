<script>

    import { page } from "$app/state";

    import { LinkHandler } from "$lib";

    import Outline from "$lib/components/Outline.svelte";

    import ImageHolder from "$lib/components/ImageHolder.svelte";

    import { onMount } from "svelte";
    import LikeButton from "$lib/components/LikeButton.svelte";
    import CodePlayground from "$lib/components/CodePlayground.svelte";

    import { draw, fade, scale, slide } from "svelte/transition";

    let elements = $state(null);

    onMount(() => {

        elements = Array.from(container.querySelectorAll("section")).filter((section) => section.querySelector("h1"));
    })

    let container;

    let currentPage = page.url.pathname.split('/').filter(Boolean).pop();

    // All the variables for the code playgrounds

    let count = $state(0);

    let selectedTransition = $state('draw');

    let selectedTransitionDuration = $state('200');

    let shown = $state(true);

</script>




<div class="blog-container">

    <div class="content">
    
        <main class="main" bind:this={container}>

            <header class="header">

                <h1>
                    Svelte Is Sweet
                </h1>

                <h2>
                    How Svelte makes modern web development easy "for the rest of us"
                </h2>

                <div class="details">

                    <p>Written by <strong>Mukesh Aryal</strong></p>

                    <p>Written on <strong>24th Nov, 2025</strong></p>

                </div>
            </header>



            <section>

                <header>

                    <figure>

                        <ImageHolder imageSource='/svelte_hero.png' imageAlt="Svelte compiler bundling the web components into chunks." />

                        <figcaption>
                            Svelte compiler bundling the web components into chunks.
                        </figcaption>
                    </figure>

                </header>

                <p>
                    The image taken from <a target="_blank" href="https://svelte.dev">svelte.dev</a> depicts the Svelte machinery
                    that uses a compiler to transform Svelte components into HTML, CSS and JavaScript.
                    <br>
                    <br>
                    There are only two ways in which any new web developer starts their web development journey: either they go down 
                    the React rabbit hole or they are forever juggling a million frameworks to do the very same thing.
                    <br>
                    <br>
                    You can't really blame them though. There are a million React courses on Udemy and five more million on YouTube.
                    When you ask an LLM to give frontend code, it almost always gives some React code. When you assess the frontend 
                    developer market (in case it hasn't been deprecated by AI, of course 😉), most of the listings are for a React 
                    developer.
                    <br>
                    <br>
                    While you can't undermine the massive impact React has had on all of web development, there are other ways to do 
                    it. And more importantly, there are other <strong>better</strong> ways to do some things on the web. And Svelte shines 
                    when you want to do just that.
                </p>

            </section>


            <section>

                <h1>
                    Reactivity Is Sweet
                </h1>

                <div>
                    <p>
                        Reactivity has been bread and butter since the advent of modern JavaScript frameworks. Svelte makes it so much
                        easier. We would always <strong>love</strong> reactive variables that just work: no getters and setters, and no 
                        worrying about the "correct" way to change them. A reactive variable should just "react" to the changes and
                        sometimes even make the developer forget that the variable was reactive!
                        <br>
                        <br>
                        That is just how Svelte reactive variables work. We create a reactive variable by using the <code>$state()</code>
                        rune in Svelte. "And how do you change them?" you ask? Just like how you would change any other variable! That is
                        the simplicity of reactivity in Svelte. Change the value and see it reflected in the UI.
                    </p>

                    <CodePlayground>

                        {#snippet codeContainer()}

                            // Create a reactive variable
                            <br>
                            let count = $state(0);
                            <br>
                            <br>
                            // Change it just like that
                            <br>
                            count = <input bind:value={count} />;
                                 

                        {/snippet}


                        {#snippet codePreview()}
                            The value of count is { count }
                        {/snippet}

                    </CodePlayground>


                </div>

            </section>


            <section>

                <h1>
                    Transitions Are Sweet
                </h1>

                <div>
                    <p>
                        You can't build a beautiful web app without some transitions and animations. While CSS itself can handle a lot of 
                        it, it gets quite tricky for component life cycles. You want to animate a component coming into the DOM and when
                        it is unmounted.
                        <br>
                        <br>
                        You could do <code>animation-fill-mode: forwards</code> for the component coming into the DOM, but it is really 
                        complicated and painful for the latter. It involves timers and too many state variables and a lot of headaches to 
                        do it properly. You'll often see libraries being used for this. Luckily for us, Svelte has this covered elegantly.
                        <br>
                        <br>
                        In Svelte, we have transitions like <code>draw</code>, <code>fade</code>, <code>scale</code> and many others available
                        right out of the box. We can just apply <code>draw</code> transition on the mount and unmount of the component using 
                        <code>transition:draw</code> on the component. Play with the values to see it in action.
                    </p>

                    <CodePlayground>

                        {#snippet codeContainer()}

                            {'<svg viewBox="0 0 24 24">'}
                            
                            <br>

                            <div style="margin-left: 2rem;">

                                {'<circle cx="12" cy="12" r="10" stroke="#ff6600" stroke-width="2" fill="none" transition:'}

                                <select bind:value={selectedTransition}>
                                    <option value="draw" selected>draw</option>
                                    <option value="fade">fade</option>
                                    <option value="scale">scale</option>
                                </select>

                                = 

                                {'{{ duration: '} 

                                <select bind:value={selectedTransitionDuration}>
                                    <option value="200" selected>200</option>
                                    <option value="400">400</option>
                                    <option value="800">800</option>
                                </select>

                                {'}} > </circle>'}

                            </div>

                            {'</svg>'}
                                 

                        {/snippet}


                        {#snippet codePreview()}

                            <div class="preview-container">

                                <div>

                                    <div style="width: 10rem; height: 10rem; margin-bottom: 2rem;">

                                        <!-- Sorry for the horrible code! :( It was not working...  -->


                                        {#if selectedTransition === "draw" }

                                            {#if shown}

                                                <svg viewBox="0 0 24 24">
                                                    <circle transition:draw={{ duration: selectedTransitionDuration }} cx="12" cy="12" r="10" stroke="#ff6600" stroke-width="2" fill="none"></circle>
                                                </svg>

                                            {/if}

                                        {/if}

                                        {#if selectedTransition === "fade" }

                                            {#if shown}

                                                <svg viewBox="0 0 24 24">
                                                    <circle transition:fade={{ duration: selectedTransitionDuration }} cx="12" cy="12" r="10" stroke="#ff6600" stroke-width="2" fill="none"></circle>
                                                </svg>
                                                
                                            {/if}

                                        {/if}

                                        {#if selectedTransition === "scale" }

                                            {#if shown}

                                                <svg viewBox="0 0 24 24">
                                                    <circle transition:scale={{ duration: selectedTransitionDuration }} cx="12" cy="12" r="10" stroke="#ff6600" stroke-width="2" fill="none"></circle>
                                                </svg>
                                                
                                            {/if}

                                        {/if}

                                    </div>

                                    <div class="button-group">
                                        <button class="code-button" onclick={() => { shown = true; }}>
                                            Enter
                                        </button>

                                        <button class="code-button" onclick={() => { shown = false; }}>
                                            Exit
                                        </button>
                                    </div>

                                </div>
                            </div>


                        {/snippet}

                    </CodePlayground>

                </div>

            </section>


            <section>

                <h1>
                    Stores Are Sweet
                </h1>

                <p>
                    When an app grows large and reactive data is to be passed around components, Svelte provides the store feature 
                    within the core library. With the store feature, you can create reactive variables which can be subscribed to for 
                    changes from any component within the app. 
                    <br>
                    <br>
                    According to the Svelte <a target="_blank" href="https://svelte.dev/docs/svelte/stores" >docs</a>, even though you 
                    can always use reactivity through <code>$state()</code> rune, store comes in handy when the data management is 
                    complex or that you require more manual control over the variables. You can use <code>writable</code> to create
                    store variables that can be modified or <code>readable</code> to only have the components subscribe to the changes
                    without the ability to change them.
                    <br>
                    <br>
                    Stores make it easier and less error prone 
                    to have state management in large applications, where you'd again have to look for external libraries to do the job in 
                    other frameworks.
                </p>

            </section>


            <section>

                <h1>
                    Bundle Size Is Sweet
                </h1>

                <p>
                    Another sweet thing about Svelte is the bundle size. As Svelte components are compiled, the actual "Svelte
                    footprint" in the final JavaScript is very little, which is present for the reactivity in applications. The 
                    extra baggage for a Svelte app would be around 3-4 KB (gzipped) but no hardcoded numbers are present online.
                    <br>
                    <br>
                    This allows for apps built with Svelte to be much leaner and thus less harsh on the browser. As a result, for 
                    small applets that need some reactivity without including the baggage that comes with a JavaScript framework,
                    Svelte is the go-to choice. That said, it can always handle day-to-day applications with ease.
                </p>

            </section>


            <section>

                <h1>
                    SvelteKit Is Sweet
                </h1>

                <p>
                    The Svelte experience is not limited to the frontend and you can use SvelteKit, the Svelte framework created 
                    and maintained by the same community, to build full stack web applications. It adds full stack capabilities to 
                    the already sweet features that Svelte provides for us.
                    <br>
                    <br>
                    Some of the sweet features of SvelteKit include filesystem-based routing which makes routing simpler and consistent 
                    throughout the app, server-side rendering to allow for rendering components on the server and passing them as 
                    HTML to the client, and remote functions for effortless type-safe communication between the client and the server. 
                </p>

            </section>


            <footer>
                <LikeButton {currentPage} />
            </footer>

        </main>

    </div>

    <div class="outlines">

        {#if elements }

            <Outline {elements} />    

        {/if}
       
    </div>

</div>




<style>

    .blog-container{
       padding: 1rem;
       display: flex;
       justify-content: center;
    }

    .outlines{
        position: fixed;
        top: 20%;
        right: 0;
        height: 40%;
    }

    .content{
        width: 60%;
    }

    .main{
        font-size: 1.25rem;
    }

    .main section h1{
        position: sticky;
        top: 4rem;
        background-color: var(--primary-background);
        padding-block: 1rem;
        margin-block: 1rem;
        font-size: 1.5em;

    }

    .main section code{
        background-color: var(--code-color);
        border-radius: 0.25rem;
        padding: 0.25rem;
        font-size: 0.8em;
    }

    .main section input, .main section select{
        vertical-align: middle;
        line-height: 1.5;
        font-family: monospace;
        font-size: 0.75rem;
        max-width: 5rem;
        background-color: #FFF0E6;
        border: none;
    }

    .main section input:focus, .main section select:focus{
        outline-color: #ff6600;
    }

    

    .main a{
        color: inherit;
    }

    .main p{
        line-height: 1.5;
        text-align: justify;
        margin: 0;
    }

    .main .header{
        margin-bottom: 2rem;
        padding-inline: 1rem;
    }

    .main footer{
        padding-inline: 1rem;
    }

    .main .header > h1{
        text-align: center;
        font-weight: bold;
        font-size: 3rem;
    }

    .main .header > h2{
        text-align: center;
        font-size: 2.4rem;
    }

    .details{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .details p{
        margin: 0;
    }

    .main section{
        padding: 1rem;
        margin-bottom: 2rem;
    }

    .main section figcaption{
        text-align: center;
        margin-block: 1rem;
    }

    .preview-container{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .button-group{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    @media (max-width: 1000px)
    {
        .content{
            width: 100%;
        }

        /* .preview-container{
            flex-direction: column;
        } */
    }

    .code-button{
        padding: 0.5rem;
        border: none;
        background-color: #ff6600;
        color: #eeeeee;
        font-size: 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
    }

</style>