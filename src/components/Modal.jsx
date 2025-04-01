const MODAL_STYLE = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "50px",
  zIndex: 1000,
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  zIndex: 1000,
};

export default function Modal(props) {
  if (!props.open) return;

  return (
    <div className="p-4 bg-white rounded-2xl" style={OVERLAY_STYLES}>
      {props.children}
    </div>,
    document.getElementById('portal')
  );
}
