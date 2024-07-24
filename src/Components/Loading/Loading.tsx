import "./Loading.css";

const Loading = () => {
  return (
    <>
      <div className="flex justify-center items-center w-screen h-[80vh]">
        <div className="rounded-full h-20 w-20 dark:bg-contrastDark bg-contrastLight animate-ping"></div>
      </div>
    </>
  )
}

export default Loading