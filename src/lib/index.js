// place files you want to import through the `$lib` alias in this folder.

import { base } from '$app/paths';

export const posts = [
  {
    url: "on-the-web",
    title: "On The Web",
    date: "16th Nov, 2025",
    hero: "/globe.svg",
    alt: "Graphic depiction of a globe",
    description: `In this blog post, I discuss about the journey of the internet from the very beginning.
      While doing so, I discuss the notable events that occurred in the journey and how it shapes the web today.
      Finally, I express my views regarding the current scenario and the way going forward.`
  },
  {
    url: "svelte-is-sweet",
    title: "Svelte Is Sweet",
    date: "24th Nov, 2025",
    hero: "/svelte.svg",
    alt: "Svelte Logo",
    description: `In this blog post, I discuss on the lovely features of the Svelte JavaScript framework.
      During my description, I point out each feature and explain its usefulness and elegance, particularly
      with the hopes of tempting more web developers to start using this beautiful framework!`
  }

]



export const LinkHandler = (link) => {

  return base + link
}
