<script>

    import { draw, fade } from "svelte/transition";

    let { elements } = $props();

    let canvasHeight = $state(null);
    let canvasWidth = $state(null);

    let scrollDistance = $state(0);
    let startElement = $state(0);

    let outlineContainer;

    let shown = $state(false);


    let lastCallScroll = 0;
    const throttleTime = 100;
    
    let lastCallPointerMove = 0;

    function handleScroll() {

        const now = Date.now();

        if (now - lastCallScroll >= throttleTime) {

            lastCallScroll = now;

            if(window.scrollY < elements[0].offsetTop)
            {
                scrollDistance = 0;
                return;
            }

            if(window.scrollY > elements[elements.length - 1].offsetTop)
            {
                scrollDistance = canvasHeight;
                return;
            }

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

            let endElement = startElement + 1;

            scrollDistance = (endElement - 1) * ((canvasHeight) / (elements.length - 1)) + (window.scrollY - elements[startElement].offsetTop) / (elements[endElement - 1 ].scrollHeight) * ((canvasHeight) / (elements.length - 1));
        }
    }

    function handleTouch(event)
    {

        const now = Date.now();

        if(now - lastCallPointerMove >= throttleTime)
        {
            lastCallPointerMove = now;

            let elementIndex = (event.clientY - outlineContainer.getBoundingClientRect().top) / (canvasHeight) * (elements.length - 1);

            if(elementIndex < 0)
            {
                return;
            }

            let elementTop = elements[Math.floor(elementIndex)].getBoundingClientRect().top;

            let elementHeight = elements[Math.floor(elementIndex)].clientHeight;

            elements[Math.floor(elementIndex)].scrollIntoView();

            window.scrollBy(0, (elementIndex - Math.floor(elementIndex)) * elementHeight);
        }
    }

    
</script>

<svelte:window on:scroll={handleScroll} />


<svg aria-hidden="true" bind:this={outlineContainer} class={`outline ${ shown ? 'shown' : '' }`} onblur={() => { shown = false; }} onclick={() => { shown = !shown; }} onpointermove={handleTouch} transition:fade width="2rem" height="100%" bind:clientHeight={canvasHeight} bind:clientWidth={canvasWidth} >

    <line x1={ canvasWidth / 2 } y1={ 0 } x2={ canvasWidth / 2 } y2={ canvasHeight } stroke-width={ 15 } stroke="#FFC299" stroke-linecap="round" ></line>

    {#if scrollDistance > 0}

        <line x1={ canvasWidth / 2 } y1={ 0 } x2={ canvasWidth / 2 } y2={ scrollDistance } stroke-width={ 15 } stroke="#ff6600" stroke-linecap="round" ></line>

    {/if}

    {#each elements as element, index }

        <circle class="circle" cx={ canvasWidth / 2 } cy={ index * ((canvasHeight) / (elements.length - 1)) } r={ 5 } ></circle>

    {/each}


</svg>



<style>

    .outline{
        cursor: pointer;
        overflow: visible;
        touch-action: none;
        transition: transform 200ms ease-in-out;
        -webkit-tap-highlight-color: transparent;
    }

    .outline:focus{
        outline: none;
    }

    .circle{
        fill: var(--primary-background);
    }

    @media (max-width: 600px)
    {
        .outline{
            transform: translateX(50%);
        }

        .outline.shown{
            transform: translateX(0);
        }
    }

</style>