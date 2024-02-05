import QrScanner from "qr-scanner";
import React, { useEffect, useRef } from "react";

type QrScannerModalProps = {
  isOpen: boolean;
  onResult: (result: string) => void;
};

const QrScannerModal = ({ isOpen, onResult }: QrScannerModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    const scanner = new QrScanner(
      videoElement,
      (result: QrScanner.ScanResult) => {
        if (result.data) {
          onResult(result.data);
        }
      },
      {}
    );

    scanner.start();

    return () => {
      scanner.destroy();
    };
  }, [onResult]);

  return (
    <>
      {isOpen ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100%",
            background: "rgba(0,0,0,.7)",
          }}
        >
          <div
            className="modal"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <video ref={videoRef} className="video-element" />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default QrScannerModal;
