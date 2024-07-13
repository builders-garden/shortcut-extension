import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { url } = req.body

  if (!url) return

  console.log("[Shortcut] Processing")
  //   const data = await fetch(url)

  res.send({
    data: {
      title: "Sample EVM Action",
      description: "This is a sample EVM Action",
      image: "https://placehold.co/955x500",
      links: [
        {
          targetUrl: `https://test.com/api/tx`,
          postUrl: `https://test.com/tx-success`,
          label: "Tx",
          type: "tx"
        },
        {
          targetUrl: `https://test.com/api/signature`,
          postUrl: "https://test.com",
          label: "Signature",
          type: "sign"
        },
        {
          targetUrl: `https://builders.garden`,
          label: "Link",
          type: "link"
        }
      ],
      label: "Sample Button"
    }
  })
}

export default handler
