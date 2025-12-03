import { useNavigate } from "react-router-dom";

type ErrorModalProps = {
  title: string;
  path?: string; // Optional now, to allow "stay on page"
  content: string;
  button: string;
  onConfirm?: () => void; // To handle "Try Again" (close modal)
  secondaryPath?: string;
  secondaryButton?: string;
};

const ErrorModal: React.FC<ErrorModalProps> = ({
  title,
  path,
  content,
  button,
  onConfirm,
  secondaryPath,
  secondaryButton,
}) => {
  const navigate = useNavigate();

  const handlePrimaryClick = () => {
    if (onConfirm) {
      onConfirm();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          textAlign: "center",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <i
            className="fa fa-times-circle"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
        </div>
        <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>{title}</h4>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>{content}</p>

        {/* Primary Button */}
        <button
          className="btn-auth"
          onClick={handlePrimaryClick}
          style={{ width: "100%", margin: 0 }}
        >
          {button}
        </button>

        {/* Secondary Button */}
        {secondaryPath && secondaryButton && (
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => navigate(secondaryPath)}
              style={{
                background: "none",
                border: "none",
                color: "#794929",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "0.9rem",
                padding: 0,
              }}
            >
              {secondaryButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorModal;
