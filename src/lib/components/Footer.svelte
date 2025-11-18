<script>
    import { LinkHandler } from "$lib";

</script>
<footer class="footer">
  <p>© 2025 Mukesh Aryal. All rights reserved.</p>
  <ul class="links">
    <li><a href={LinkHandler('/')}>Find me on Twitter</a></li>
    <li><a href={LinkHandler('/')}>Privacy Policy</a></li>
  </ul>
</footer>

<style>
    .footer{
      background-color: var(--secondary-background);
      padding: 1rem;
      text-align: center; 
    }

    .links{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        list-style: none;
        margin: 0;
        padding-inline-start: 0;
    }

    .links a{
        color: var(--text-color);
    }



</style>
