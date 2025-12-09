interface INotFoundProps {}

const NotFound: React.FunctionComponent<INotFoundProps> = ({}) => {
  return (
    <div className="flex items-center justify-center pt-24 md:pt-48 lg:pt-54">
      <div className="font-bold text-3xl border-r px-6">404</div>
      <div className="px-6 text-lg">Not Found</div>
    </div>
  )
}

export default NotFound
