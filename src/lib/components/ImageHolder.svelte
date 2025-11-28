<script>

    import { LinkHandler } from "$lib";

    let { imageSource, imageAlt } = $props();

    let fullScreen = $state(false);

    let imageLoaded = $state(false);

</script>



<div class={`image-container ${ fullScreen ? 'full-screen' : '' }`}>

    {#if fullScreen}
       <button aria-label="Close" class="close-button" onclick={() => { fullScreen = false; }}>
            <svg width="1.5rem" height="1.5rem" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EEEEEE" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"/>
            </svg>
        </button> 
    {/if}

    <div class={`wrapper ${ imageLoaded ? 'loaded' : 'loading' }`}>
        <img onclick={() => { fullScreen = true; }} onload={() => { imageLoaded = true; }} src={LinkHandler(imageSource)} alt={imageAlt} />
    </div>

        

</div>



<style>

    .image-container img{
        max-width: 100%;
        max-height: 100%;
        border-radius: 0.5rem;
        vertical-align: middle;
    }

    .wrapper{
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: var(--secondary-background);
    }

    .wrapper.loading{
        animation: pulse 2s ease-in-out infinite;
    }

    .wrapper img{
        visibility: hidden;
    }

    .wrapper.loaded img{
        visibility: visible;
    }

    .image-container img{
        cursor: pointer;
    }

    .image-container.full-screen img{
        cursor: unset;
    }

    .image-container.full-screen{
        position: fixed;
        inset: 0;
        padding: 1rem;
        background-color: var(--primary-background);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
    }

    .close-button{
        position: absolute;
        top: 2rem;
        right: 2rem;
        border: none;
        background-color: #FF3F00AA;
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        border-radius: 5rem;
        cursor: pointer;
    }

    @keyframes pulse{

        50%{
            transform: scale(1.01);
        }
    }

    

</style>
