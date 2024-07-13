import Wrapper from "~shared/wrapper"

import "../assets/style.css"

import { useState } from "react"

function IndexPopup() {
  // @ts-ignore
  console.log(window.ethereum, "ETHEREUM")
  const [data, setData] = useState("")

  return (
    <Wrapper>
      <div className="bg-red-500">
        <h2>
          Welcome to your{" "}
          <a href="https://www.plasmo.com" target="_blank">
            Plasmo
          </a>{" "}
          Extension!
        </h2>
        <input onChange={(e) => setData(e.target.value)} value={data} />
        <a href="https://docs.plasmo.com" target="_blank">
          View Docs
        </a>
      </div>
    </Wrapper>
  )
}

export default IndexPopup
