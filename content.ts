import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  run_at: "document_end",
  matches: ["<all_urls>"],
  world: "MAIN"
}

if (window.parent) {
  window.ethereum = window.parent.ethereum
}

async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message)

  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // convert bytes to hex string
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

const isValidElement = (tag: string, element: Element) => {
  if (tag === "code" && element.innerHTML.includes("eal://")) return true
  if (tag === "span" && element.textContent?.includes("eal://")) return true
  return false
}

const handleElement = async (tag: string, element: Element) => {
  try {
    const eal = tag === "code" ? element.innerHTML : element.textContent
    const url = `https://${eal?.split("eal://")[1]}`

    // console.log(url)

    const hash = await sha256(url)
    const newId = `eal-cs-${hash}`

    if (element.parentNode?.querySelector(`#${newId}`)) return

    console.log("[Shortcut] Calling")

    // const newDiv = document.createElement("button")
    // newDiv.id = newId
    // newDiv.style.display = "flex"
    // newDiv.style.flexDirection = "column"
    // newDiv.style.alignItems = "center"
    // newDiv.style.width = "420px"
    // newDiv.style.backgroundColor = "hsl(220 calc( 1 * 6.5%) 18% / 1)"
    // newDiv.style.marginTop = "8px"
    // newDiv.style.borderRadius = "4px"
    // newDiv.style.padding = ".5em"
    // newDiv.style.border = "1px solid hsl(225 calc( 1 * 6.3%) 12.5% / 1)"
    // newDiv.style.cursor = "pointer"
    // newDiv.style.marginRight = "auto"
    // newDiv.style.marginLeft = "auto"
    // newDiv.innerText = "Launch EVM Action"
    // newDiv.style.color = "white"
    // newDiv.onclick = () => {
    //   window.open(
    //     `chrome-extension://dkfjmmpblkmjonmaemcmngophheaolkh/tabs/eal.html?action=${encodeURIComponent(eal)}`,
    //     "_blank",
    //     "noopener,noreferrer,popup=true,width=500,height=600"
    //     //",popup=true,width=500,height=600"
    //   )
    // }

    // element.parentNode?.appendChild(newDiv)

    const newIframe = document.createElement("iframe")
    console.log(eal, "[Shortcut] EAL")
    const encodedEAL = encodeURIComponent(eal.replaceAll("&amp;", "&"))
    console.log(encodedEAL, "[Shortcut] Encoded EAL")
    newIframe.src = `chrome-extension://dkfjmmpblkmjonmaemcmngophheaolkh/tabs/eal.html?action=${encodedEAL}`
    newIframe.width = "430"
    newIframe.height = "430"
    // newIframe.style.backgroundColor = "white"
    newIframe.style.marginTop = "8px"
    newIframe.style.border = "none"

    element.parentNode?.appendChild(newIframe)
    element.remove()

    // const { data } = await sendToBackground({
    //   name: "process",
    //   body: { url },
    //   extensionId: "dkfjmmpblkmjonmaemcmngophheaolkh"
    // })

    // const newDiv = document.createElement("div")
    // newDiv.id = newId
    // newDiv.style.display = "flex"
    // newDiv.style.flexDirection = "column"
    // newDiv.style.alignItems = "center"
    // newDiv.style.width = "420px"
    // newDiv.style.backgroundColor = "hsl(220 calc( 1 * 6.5%) 18% / 1)"
    // newDiv.style.marginTop = "8px"
    // newDiv.style.borderRadius = "4px"
    // newDiv.style.padding = ".5em"
    // newDiv.style.border = "1px solid hsl(225 calc( 1 * 6.3%) 12.5% / 1)"

    // const img = document.createElement("img")
    // img.src = data.image
    // img.width = 400
    // img.height = 400
    // img.style.border = "1px solid hsl(225 calc( 1 * 6.3%) 12.5% / 1)"

    // const a = document.createElement("a")
    // a.style.fontSize = "12px"
    // a.href = url
    // a.innerText = url

    // const title = document.createElement("h3")
    // title.innerText = data.title
    // title.style.padding = "0 !important"

    // const description = document.createElement("p")
    // description.innerText = data.description

    // const actionsGrid = document.createElement("div")
    // actionsGrid.style.display = "grid"
    // actionsGrid.style.gridTemplateColumns = "1fr 1fr"
    // // add gap
    // actionsGrid.style.gap = "8px"

    // for (const link of data.links) {
    //   const linkButton = document.createElement("div")
    //   linkButton.innerText = link.label
    //   linkButton.style.cursor = "pointer"
    //   linkButton.style.padding = ".5em"
    //   linkButton.style.border = "1px solid hsl(225 calc( 1 * 6.3%) 12.5% / 1)"
    //   linkButton.style.borderRadius = "4px"
    //   linkButton.style.textAlign = "center"
    //   linkButton.style.backgroundColor = "#7289da"
    //   linkButton.style.color = "white"
    //   linkButton.style.fontWeight = "600"

    //   if (link.type === "link") {
    //     linkButton.onclick = () => {
    //       window.open(link.targetUrl, "_blank")
    //     }
    //   } else if (link.type === "tx") {
    //     linkButton.onclick = async () => {}
    //   }

    //   actionsGrid.appendChild(linkButton)
    // }

    // newDiv.appendChild(img)
    // newDiv.appendChild(a)
    // newDiv.appendChild(title)
    // newDiv.appendChild(description)
    // newDiv.appendChild(actionsGrid)

    // element.parentNode?.appendChild(newDiv)

    // element.remove()
  } catch (error) {
    console.error(error, "[Shortcut] Error")
  }
}

const searchElements = async (tag: string) => {
  const tags = document.querySelectorAll(tag)

  for (const element of tags) {
    if (isValidElement(tag, element)) {
      await handleElement(tag, element)
    }
  }
}

const isDiscord = document.URL.includes("https://discord.com")

if (isDiscord) {
  document.addEventListener("mouseover", () => searchElements("code"))
} else {
  document.addEventListener("scroll", () => searchElements("span"))
}
