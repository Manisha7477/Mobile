interface IModalComponentProps {
  showModal: boolean
  handleCloseModal: Function
  title: string
  children: React.ReactNode
  width?: string
  height?: string
}

const ModalComponent: React.FunctionComponent<IModalComponentProps> = ({
  showModal,
  handleCloseModal,
  title,
  children,
  width="w-11/12 max-w-5xl",
  height=""
}) => {
  return (
    <>
      <input
        type="checkbox"
        className="modal-toggle hidden"
        defaultChecked={showModal}
      />
      <div className="modal modal-middle">
        <div className={`modal-box ${width} ${height}`}>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => handleCloseModal(false)}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg text-primary">{title}</h3>
          <div className="py-4">{children}</div>
        </div>
      </div>
    </>
  )
}

export default ModalComponent
