<script>

    let { codeContainer, codePreview } = $props();

</script>

<div class="code-playground">

    <div class="code-container">

        {@render codeContainer()}

    </div>

    {#if codePreview}

        <div class="preview-container">    

            {@render codePreview()}   

        </div>

    {/if}

</div>


<style>

    .code-playground{
        background-color: #FF660055;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
        border-radius: 0.25rem;
        padding: 1rem;
    }

    .code-container{
        font-family: monospace;
        font-size: 0.75em;
        line-height: 1.5;
    }

    .code-container, .preview-container{
        background-color: #FFF0E655;
        border-radius: 0.25rem;
        padding: 1rem;
        flex-grow: 1;
    }

</style>