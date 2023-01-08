import { NextPage } from "next"
import { Fragment } from "react"
import OverlayCss from "../styles/Overlay.module.css"

interface Props {
  isOpen: boolean
  onClose: () => void
//   children: React.ReactNode
}

const Overlay: NextPage<Props> = (props) => {
  const { isOpen, onClose } = props
  return (
    <Fragment>
      {isOpen && (
        <div className={OverlayCss.overlay}>
          <div className={OverlayCss.overlay__background} onClick={onClose} />
          <div className={OverlayCss.overlay__container}>
            {/* <div className={OverlayCss.overlay__controls}>
              <button className={OverlayCss.overlay__close} type="button" onClick={onClose} />
            </div> */}
            {/* {children} */}
            <h1 className="text-black">Transitioning to Metamask now...</h1>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Overlay
