<script>

    import { fade } from "svelte/transition";

    let { elements } = $props();

    let canvasHeight = $state(null);
    let canvasWidth = $state(null);

    let scrollDistance = $state(0);


    let lastCall = 0;
    const throttleTime = 100; 

    function handleScroll() {

        const now = Date.now();

        if (now - lastCall >= throttleTime) {
            lastCall = now;

            let startElement = 0;
            let endElement = 0;

            if(window.scrollY < elements[0].offsetTop)
            {
                scrollDistance = 0;
                return;
            }

            if(window.scrollY > elements[elements.length - 1].offsetTop)
            {
                scrollDistance = canvasHeight - 20;
                return;
            }

            // We are starting to scroll past the current section

            for(let i = 0; i < elements.length - 1; i++)
            {
                if(window.scrollY > elements[i].offsetTop)
                {
                    startElement = i;
                }
                else
                {
                    break;
                }
            }

            endElement = startElement + 1;

            scrollDistance = (endElement - 1) * ((canvasHeight - 20) / (elements.length - 1)) + (window.scrollY - elements[startElement].offsetTop) / (elements[endElement - 1 ].scrollHeight) * ((canvasHeight - 20) / (elements.length - 1));
        }
    }

    
</script>

<svelte:window on:scroll={handleScroll} />


<svg class="outline" transition:fade width="2rem" height="100%" bind:clientHeight={canvasHeight} bind:clientWidth={canvasWidth} >

    <line x1={ canvasWidth / 2 } y1={ 10 } x2={ canvasWidth / 2 } y2={ canvasHeight - 10 } stroke-width={ 1 } stroke="#FFC299" ></line>

    <line x1={ canvasWidth / 2 } y1={ 10 } x2={ canvasWidth / 2 } y2={ 10 + scrollDistance } stroke-width={ 2 } stroke="#ff6600" ></line>

    {#each elements as element, index }

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <g tabindex="0" role="menuitem" aria-roledescription="Menu for the different headings" class="circle-group"  onclick={() => { element.scrollIntoView();}}>
        <circle class="larger-circle" cx={ canvasWidth / 2 } cy={ 10 + index * ((canvasHeight - 20) / (elements.length - 1)) } r={ 25 } ></circle>
        <circle class="smaller-circle" cx={ canvasWidth / 2 } cy={ 10 + index * ((canvasHeight - 20) / (elements.length - 1)) } r={ 5 } stroke-width={ 2 } stroke="#ff6600" ></circle>
    
    <text x={ canvasWidth / 2 - 20 } y={ 15 + index * ((canvasHeight - 20) / (elements.length - 1)) }>
        { element.querySelector("h1").textContent }
    </text>
    
    
    </g>


    {/each}


</svg>



<style>

    .circle-group text{
        fill: #ff6600;
        text-anchor: end;
        visibility: hidden;
    }

    .circle-group:focus{
        outline: none;
    }

    .circle-group:hover text, .circle-group:focus text{
        visibility: visible;
    }

    .circle-group:foc text{
        visibility: visible;
    }


    .outline{
        cursor: pointer;
        overflow: visible;
    }

    .circle-group .smaller-circle{
        transform-origin: center;
        transform-box: fill-box;
        fill: var(--primary-background);
        transition: all 200ms ease-in-out;
        border: 100px solid transparent;
    }

    .circle-group .larger-circle{
        fill: transparent;
    }

    .circle-group:hover .smaller-circle, .circle-group:focus .smaller-circle {
        transform: scale(1.5);
        fill: #ff6600;
    }
</style>