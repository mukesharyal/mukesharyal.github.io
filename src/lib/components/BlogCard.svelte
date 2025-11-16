<script>

    const { fileName } = $props();

    const title = fileName.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

    // Glob all images
    const images = import.meta.glob('$lib/assets/*', { eager: true, as: 'url' });

    // Get the specific image URL
    const img = images[`/src/lib/assets/${fileName}.jpg`];

</script>

<a class="card-wrapper" href="/post/{fileName}">

    <div class="card">

        <img src={img} alt={title} />

        <div class="details">
            <h3>
                {title}
            </h3>

            <p>
                Mukesh Aryal
            </p>
        </div>
    </div>
</a>

<style>
    .card-wrapper{
        text-decoration: none;
        color: inherit;
    }

    .card{
        max-width: 20vw;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .card img{
        width: 100%;
    }

    .card .details{
        padding: 1rem;
    }

    .card .details p{
        margin: 0;
    }
</style>