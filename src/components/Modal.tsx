import { forwardRef, useImperativeHandle, useRef } from "react"

const Modal = forwardRef((props: {name:string}, ref)=> {
    const modalRef = useRef<HTMLDialogElement>(null)
    
    useImperativeHandle(ref, () => {
        return {
            show() {
                if (modalRef.current) modalRef.current.showModal();
            }
        }
    })

    const handleClick = () => {
        modalRef.current?.close()
    }
    
    return (
        <dialog ref={modalRef}>
            <p>{props.name}</p>
            <button onClick={handleClick}>Exit</button>
        </dialog>
    )
})

export default Modal