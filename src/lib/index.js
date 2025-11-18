// place files you want to import through the `$lib` alias in this folder.

import { base } from '$app/paths'

export const posts = [
  
    {
        url: "i-love-the-web",
        title: "I ❤️ The Web",
        date: "16th Nov, 2025",
        hero: "/globe.svg",
        alt: "Graphic depiction of a globe",
        description: `In this blog post, I discuss about the journey of the internet from the very beginning.
        While doing so, I discuss the notable events that occurred in the journey and how it shapes the web today.
        Finally, I express my views regarding the current scenario and the way going forward.`
    }

]



export const LinkHandler = (link) => {
    
  if (process.env.NODE_ENV === 'development') {
    return link
  }

  if (link === '/') {
    return base
  }

  return base + link
}
