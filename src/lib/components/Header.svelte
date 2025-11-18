<script>

    import { draw } from "svelte/transition";

    import { LinkHandler } from "$lib";
    
    let isOpen = $state(false);

</script>



<nav aria-label="Main Navigation" class="nav-container">

    <a href={LinkHandler('/')} class="logo" aria-label="Homepage">
      मुकेश अर्याल
    </a>

    <button id="hamburger" title="Expand menu" onclick={() => { isOpen = !isOpen } } onblur={() => { isOpen = false; }}>

        {#if isOpen }
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" > 
                <line x1="3" y1="3" x2="18" y2="18" in:draw={{duration: 300}} />
                <line x1="3" y1="18" x2="18" y2="3" in:draw={{duration: 300}} />
            </svg>

        {:else}

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round"> 
                <line x1="3" y1="6" x2="21" y2="6" in:draw={{duration: 300}} />
                <line x1="3" y1="12" x2="21" y2="12" in:draw={{duration: 300}} />
                <line x1="3" y1="18" x2="21" y2="18" in:draw={{duration: 300}} />
            </svg>

        {/if}

    </button>



    <ul class="nav-list { isOpen ? 'open' : 'closed' }">
        <li class="nav-item"><a href={LinkHandler('/blog')} class="nav-link">Blog</a></li>
        <li class="nav-item"><a href={LinkHandler('/')} class="nav-link">Projects</a></li>
        <li class="nav-item"><a href={LinkHandler('/')} class="nav-link">Contact</a></li>
    </ul>




</nav>



<style>
    .nav-container{
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        position: fixed;
        inset: 0 0 auto 0;
        z-index: 1;
        background-color: var(--secondary-background);
    }

    .logo{
        text-decoration: none;
        color: inherit;
        font-size: 1.5rem;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nav-list {
        list-style: none;
        display: flex;
        gap: 1rem;
        color: inherit;
        padding-inline-start: unset;
        margin: 0;
    }

    .nav-list li{
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        line-height: 1;
    }

    .nav-list li a:hover{
        background-color: var(--primary-background);
    }

    .nav-list li a {
        text-decoration: none;
        color: inherit;
        padding: 0.5rem;
        border-radius: 0.25rem;
    }

    #hamburger{
        display: none;
        border: none;
        padding: 0.25rem;
        background-color: transparent;
    }

    #hamburger svg{
        height: 1.5rem;
        stroke: var(--text-color);
    }

    @keyframes slideIn{
        to{
            transform: translateX(0)
        }
    }

    @media (max-width: 600px) {

        #hamburger{
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .nav-list {
            position: absolute;
            flex-direction: column;
            top: 100%;
            right: 0;
            padding: 0.5rem;
            transform: translateX(100%);
            transition: transform 200ms ease-in-out;
        }

        .nav-list li{
            text-align: center;
            padding: 0.25rem 0.5rem;
            border-radius: 100vw; 
            background-color: #8BC1C8;
            color: #1A3438;
        }

        .nav-list.open{
            transform: translateX(0);
        }

        .nav-list.open li{
            transform: translateX(100%);
        }

        .nav-list.open li:nth-of-type(1){
            animation: slideIn 200ms linear 100ms forwards;
        }

        .nav-list.open li:nth-of-type(2){
            animation: slideIn 200ms linear 150ms forwards;
        }

        .nav-list.open li:nth-of-type(3){
            animation: slideIn 200ms linear 200ms forwards;
        }
    }
</style>