import "../assets/style.css"

function IndexPopup() {
  return (
    <div className="p-4 w-[300px] space-y-4">
      <h1 className="font-bold text-2xl text-center">⚡ Shortcut</h1>
      <div className="grid grid-cols-2 gap-x-4">
        <a href="https://evm-actions.builders.garden" target="_blank">
          <div className="px-4 py-2 border rounded-xl cursor-pointer">
            <p className="text-center text-lg font-semibold">Docs</p>
          </div>
        </a>
        <a href="https://github.com/builders-garden" target="_blank">
          <div className="px-4 py-2 border rounded-xl cursor-pointer">
            <p className="text-center text-lg font-semibold">Github</p>
          </div>
        </a>
      </div>
      <p className="text-xs text-center text-gray-400">
        built by 🌳{" "}
        <a
          href="https://builders.garden"
          className="text-emerald-500 hover:text-emerald-700 hover:underline"
          target="_blank">
          builders.garden
        </a>
      </p>
    </div>
  )
}

export default IndexPopup
