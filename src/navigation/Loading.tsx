import { classNames } from "@/utils/dom"

interface ILoadingProps {
  color?: string
}

const Loading: React.FunctionComponent<ILoadingProps> = ({ color }) => {
  return (
    <div className="flex w-full items-center justify-center">
      <span
        className={classNames(
          "loading loading-spinner",
          color ?? "text-primary",
        )}
      ></span>
    </div>
  )
}

export default Loading
