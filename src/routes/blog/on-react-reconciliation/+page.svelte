<script>

    import { page } from "$app/state";

    import { LinkHandler } from "$lib";

    import Outline from "$lib/components/Outline.svelte";

    import ImageHolder from "$lib/components/ImageHolder.svelte";

    import { onMount } from "svelte";
    import LikeButton from "$lib/components/LikeButton.svelte";
    import CodePlayground from "$lib/components/CodePlayground.svelte";

    let elements = $state(null);

    onMount(() => {

        elements = Array.from(container.querySelectorAll("section")).filter((section) => section.querySelector("h1"));
    })

    let container;

    let currentPage = page.url.pathname.split('/').filter(Boolean).pop();

</script>




<div class="blog-container">

    <div class="content">
    
        <main class="main" bind:this={container}>

            <header class="header">

                <h1>
                    On React Reconciliation
                </h1>

                <h2>
                    A weird React behaviour I stumbled upon
                </h2>

                <div class="details">

                    <p>Written by <strong>Mukesh Aryal</strong></p>

                    <p>Written on <strong>28th Nov, 2025</strong></p>

                </div>
            </header>



            <section>

                <header>

                    <figure>

                        <ImageHolder imageSource='/react_official.jpeg' imageAlt="React" />

                        <figcaption>
                            React Logo from <a target="_blank" href="https://www.linkedin.com/company/reactofficial">React LinkedIn Page</a>
                        </figcaption>
                    </figure>

                </header>

                <p>
                    React is the most popular JavaScript frontend library that is powering small and big websites from Facebook
                    and GitHub to countless projects and web apps. I am also building a web app and I am using React for 
                    the frontend.
                    <br>
                    <br>
                    While working on the app's optimization today, I noticed a weird performance bug. For some reason, when a 
                    sibling component in my app was re-rendering, it was causing a re-render of another sibling component as 
                    well. That just didn't make sense and I dug deeper and deeper, until I noticed something quite strange. I was 
                    able to fix the problem and I am writing this blog post to share what I found.
                </p>

            </section>


            <section>

                <h1>
                    The Problem
                </h1>

                <div>

                    <p>
                        While running some tests to verify whether what I had found was genuine or not, I created a simple reproduction 
                        of the behaviour. It is a simple React app created with Vite with the command <code>npm create vite@latest</code>
                        and then React is chosen for the framework. Then, I removed the starter code and styles and had a project with 
                        just 3 components: <code>App</code>, <code>ComponentA</code> and <code>ComponentB</code>.
                        <br>
                        <br>
                        The <code>App</code> component looks like this:
                    </p>
                    
                    <br>

                    <CodePlayground>

                        {#snippet codeContainer()}
                            import ComponentA from './components/ComponentA';
                            <br>
                            import ComponentB from './components/ComponentB';
                            <br>
                            <br>
                            {`function App() {`}
                            <br>
	                        {`return(`}
                       
                            <div style="margin-left: 2rem;">
                                {`<div>`}
                                <br>
                                <br>
                                <div style="margin-left: 2rem;">
                                    {`<div>`}
                                    <div style="margin-left: 2rem;">
                                        {`<ComponentA />`}
                                    </div>
                                    {`</div>`}
                                </div>
                                <br>
                                <div style="margin-left: 2rem;">
                                    {`<div>`}
                                    <div style="margin-left: 2rem;">
                                        {`<ComponentB />`}
                                    </div>
                                    {`</div>`}
                                </div>
                                
                                <br>
                                {`</div>`}
                            </div>  
                            {`);`}
                            <br>
                            {`}`}
                            <br>
                            export default App;
                        {/snippet}
                    </CodePlayground>

                    <br>

                    <p>
                        The <code>ComponentA</code> looks like this:
                    </p>

                    <br>

                    <CodePlayground>

                        {#snippet codeContainer()}
                            {`import { useState } from "react";`}
                            <br>
                            <br>
                            {`export default function ComponentA()`}
                            <br>
                            {`{`}
                            <br>
                            <div style="margin-left: 2rem;">
                                {`console.log("Component A rendered!");`}
                                <br>
                                <br>
                                {`const [count, setCount] = useState(0);`}
                                <br>
                                <br>
                                {`return(`}
                                <br>
                                <div style="margin-left: 2rem;">
                                    {`<>`}
                                    <br>
                                    <div style="margin-left: 2rem;">
                                        {`<h1>`}
                                        <br>
                                        <div style="margin-left: 2rem;">
                                            {`Component A`}
                                        </div>
                                        {`</h1>`}
                                        <br>
                                        {`<h2>`}
                                        <br>
                                        <div style="margin-left: 2rem;">
                                            {`Count is {count}`}
                                        </div>
                                        {`</h2>`}
                                        <br>
                                        <br>
                                        {`<button onClick={() => { setCount(count => count + 1) }}>`}
                                        <br>
                                        <div style="margin-left: 2rem;">
                                            {`Increase Count`}
                                        </div>
                                        {`</button>`}
                                    </div>
                                    {`</>`}
                                </div>
                                {`)`}
                            </div>
                            {`}`}
                        {/snippet}

                    </CodePlayground>

                    <br>

                    <p>
                        Here is <code>ComponentB</code>:
                    </p>

                    <br>

                    <CodePlayground>

                        {#snippet codeContainer()}
                            {`export default function ComponentB()`}
                            <br>
                            {`{`}
                            <br>
                            <div style="margin-left: 2rem;">
                                {`console.log("Component B rendered!");`}
                                <br>
                                <br>
                                {`return(`}
                                <br>
                                <div style="margin-left: 2rem;">
                                    {`<>`}
                                    <br>
                                    <div style="margin-left: 2rem;">
                                        {`<h1>`}
                                        <br>
                                        <div style="margin-left: 2rem;">
                                            {`Component B`}
                                        </div>
                                        {`</h1>`}
                                    </div>
                                    {`</>`}
                                </div>
                                {`)`}
                            </div>
                            {`}`}
                        {/snippet}

                    </CodePlayground>

                    <br>

                    <p>
                        Now, I just use the <code>Profiler</code> from <code>React Devtools</code> and record a session. I just click the button 
                        a bunch of times and see the Profiler data. Here is what I see:
                    </p>

                    <br>

                    <ImageHolder imageSource='/rerenders.png' imageAlt="An image showing the number of times different components re-rendered" />

                    <br>

                    <p>
                        Here is what the <code>Profiler</code> has:
                    </p>

                    <br>

                    <ImageHolder imageSource='/profiler.png' imageAlt="The Profiler data" />

                    <br>

                    <p>
                        What? It took more time to "re-render" <code>ComponentB</code> than <code>ComponentA</code> itself? Hmm..
                        That doesn't make any sense.
                        <br>
                        <br>
                        For now, let's see why <code>ComponentA</code> had re-rendered:
                    </p>

                    <br>

                    <ImageHolder imageSource="/component_a_rerender.png" imageAlt="Why ComponentA had re-rendered" />

                    <br>

                    <p>
                        Well.... Because hook 1 changed! Makes sense! Fair enough.
                        <br>
                        <br>
                        But now is where things get interesting! Let's see why <code>ComponentB</code> had "re-rendered!":
                    </p>

                    <br>

                    <ImageHolder imageSource="/component_b_rerender.png" imageAlt='Why ComponentB had "re-rendered"' />

                    <br>

                    <p>
                        And by now you must be scratching your head. It says that <code>ComponentB</code> "re-rendered" because 
                        its parent re-rendered! But the <code>App</code> component didn't re-render at all! And it gets even
                        crazier! Let's investigate the logs!
                    </p>

                    <br>

                    <ImageHolder imageSource='/logs.png' imageAlt="The console log messages" />

                    <br>

                    <p>
                        <code>ComponentB</code> just rendered the first time and never re-rendered at all! This is what we 
                        also expect given they are the children of siblings, or cousins if you will! The function <code>ComponentB</code>
                        didn't run again, and yet the Profiler says that the component "re-rendered".
                        <br>
                        <br>
                        So, why did the <code>Profiler</code> tell us that <code>ComponentB</code> "re-rendered" because its
                        parent "re-rendered"? That's what we want to find out!
                    </p>

                </div>

            </section>


            <section>

                <h1>
                    Changing The Structure
                </h1>

                <div>

                    <p>
                        Now, let's change the structure of the <code>App</code> component just slightly and see what happens.
                    </p>

                    <CodePlayground>

                        {#snippet codeContainer()}
                            import ComponentA from './components/ComponentA';
                            <br>
                            import ComponentB from './components/ComponentB';
                            <br>
                            <br>
                            {`function App() {`}
                            <br>
	                        {`return(`}
                       
                            <div style="margin-left: 2rem;">
                                {`<div>`}
                                <br>
                                <br>
                                <div style="margin-left: 2rem;">
                                    {`<div>`}
                                    <div style="margin-left: 2rem;">
                                        {`<ComponentA />`}
                                    </div>
                                    {`</div>`}
                                </div>
                                <br>
                                <div style="margin-left: 2rem;">
                                    {`<ComponentB />`}
                                    <br>
                                    <br>
                                    {`<div>`}
                                    <div style="margin-left: 2rem;">
                                        
                                    </div>
                                    {`</div>`}
                                </div>
                                
                                <br>
                                {`</div>`}
                            </div>  
                            {`);`}
                            <br>
                            {`}`}
                            <br>
                            export default App;
                        {/snippet}

                    </CodePlayground>

                    <br>

                    <p>
                        Let's again look at the re-renders:
                    </p>

                    <br>

                    <ImageHolder imageSource='/rerenders_second.png' imageAlt="Components after the change" />

                    <br>

                    <p>
                        Now that makes sense and is what we actually expect!
                        <br>
                        <br>
                        Let's confirm the <code>Profiler</code> data as well:
                    </p>

                    <br>

                    <ImageHolder imageSource='/profiler_second.png' imageAlt="Profiler data after the change" />

                    <br>

                    <p>
                        Let's make sure everything is fine by verifying the console logs:
                    </p>

                    <br>

                    <ImageHolder imageSource='/logs_second.png' imageAlt="Logs after the change" />

                    <p>
                        Yep! Again what we expect!
                        <br>
                        <br>
                        So, we now know how to "fix" the issue. As it turns out (from the observations we've done so far),
                        there is either an issue with how the reconciliation algorithm is implemented or the profiler is 
                        showing some wrong data.
                    </p>

                </div>

            </section>


            <section>

                <h1>
                    Implications
                </h1>

                <div>

                    <p>
                        You might be thinking that the cousin situation is not that common and that it was not a big deal.
                        But, there will be soooo many cousins in compositions in apps. If this fails for compositions as well,
                        then it will be a BIG problem. Let's change the structure a bit more and see.
                        <br>
                        <br>
                        Let's define a <code>Wrapper</code> component that wraps the components.
                    </p>

                    <br>

                    <CodePlayground>

                        {#snippet codeContainer()}
                            {`export default function Wrapper({ children })`}
                            <br>
                            {`{`}
                            <br>
                            <div style="margin-left: 2rem;">
                                {`return(`}
                                <br>
                                <div style="margin-left: 2rem;">
                                    {`<div>`}
                                    <br>
                                    <div style="margin-left: 2rem;">
                                        {`{ children }`}
                                    </div>
                                    {`</div>`}
                                </div>
                                {`)`}
                            </div>
                            {`}`}
                        {/snippet}

                    </CodePlayground>

                    <br>

                    <p>
                        And our new <code>App</code> component looks like this:
                    </p>

                    <br>

                    <CodePlayground>


                        {#snippet codeContainer()}
                            import Wrapper from './components/Wrapper';
                            <br>
                            import ComponentA from './components/ComponentA';
                            <br>
                            import ComponentB from './components/ComponentB';
                            <br>
                            <br>
                            {`function App() {`}
                            <br>
                            <div style="margin-left: 2rem;">
                                {`return(`}
                                <br>
                                <div style="margin-left: 2rem;">
                                    {`<Wrapper>`}
                                    <br>
                                    <br>
                                    <div style="margin-left: 2rem;">
                                        {`<Wrapper>`}
                                        <div style="margin-left: 2rem;">
                                            {`<ComponentA />`}
                                        </div>
                                        {`</Wrapper>`}
                                    </div>
                                    <br>
                                    <br>
                                    <div style="margin-left: 2rem;">
                                        {`<Wrapper>`}
                                        <div style="margin-left: 2rem;">
                                            {`<ComponentB />`}
                                        </div>
                                        {`</Wrapper>`}
                                    </div>
                                    <br>
                                    {`</Wrapper>`}
                                </div>
                                {`);`}
                            </div>
                            {`}`}
                            <br>
                            export default App;
                        {/snippet}

                    </CodePlayground>

                    <br>

                    <p>
                        And how does the Profiler look like now? Good news! We don't see the issue! So, we can conclude that 
                        the issue was only seen in the case of using a <code>div</code> inside the component.
                        <br>
                        <br>
                        Also, there won't be performance issues due to this in compositions throughout millions of React apps,
                        given that they aren't using <code>div</code>s for the composition and layout. It shouldn't too. That's great news.
                    </p>

                </div>

            </section>


            <section>

                <h1>
                    Conclusion
                </h1>

                <p>
                    So, we have seen that there is a little weird behaviour when we write our composition using <code>div</code>s. 
                    But, when we use composition and <strong>then</strong> wrap the the individual components in <code>div</code>s 
                    we see no problem whatsoever. For my app, I needed the parent component to define the layout inside which the 
                    children component would be rendered and thus used the <code>div</code>s to enclose the children.
                    <br>
                    <br>
                    Due to my composition design and the weird React reconciliation behaviour, I saw that weird behaviour. I am also
                    opening an issue on the React GitHub to let more people know about this, and have a discussion with the 
                    team on whether this is expected behaviour (which I doubt it is) or a bug. I will also post the update on this 
                    post after I have the discussion.
                    <br>
                    <br>
                    Until next time! 👋
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

    .main a{
        color: inherit;
    }

    .main sup a{
        text-decoration: none;
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

    @media (max-width: 1000px)
    {
        .content{
            width: 100%;
        }
    }

</style>