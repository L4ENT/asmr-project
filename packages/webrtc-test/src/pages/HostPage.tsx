import { useContext, useEffect, useState } from "react";
import { PeerContext } from "../providers/PeerProvider";
import QrScannerModal from "../components/QrScannerModal";
import MovingCircle from "../games/tennis/MovingCircle";

const HostPage = () => {
  const {
    peerConnection,
    localDescription,
    remoteDescription,
    localQRCode,
    remoteQRCode,
    setLocalDescription,
    setRemoteDescription,
  } = useContext(PeerContext);

  const [qrScannerModalIsOpen, setQrScannerModalIsOpen] = useState(false);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel>()

  useEffect(() => {
    if (!peerConnection) {
      return;
    }

    const dataChannel = peerConnection.createDataChannel("test");
    setDataChannel(dataChannel)
    dataChannel.onopen = (e) => {
      console.log("SENDER CHANNEL OPEN", e);

      dataChannel.onmessage = (e) => console.log("Сообщение от пира:", e.data);
    };
  }, [peerConnection]);

  const onClickHostCreateOffer = async () => {
    if (!peerConnection || !setLocalDescription) {
      return;
    }
    const newOffer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(newOffer);
    setLocalDescription(JSON.stringify(peerConnection.localDescription));
  };

  const onClickHostSetAnswer = async () => {
    if (!peerConnection || !remoteDescription) {
      return;
    }
    peerConnection.setRemoteDescription(
      new RTCSessionDescription(JSON.parse(remoteDescription))
    );
  };

  const onClickScan = async () => {
    setQrScannerModalIsOpen(true);
  };

  const onResult = (result: string) => {
    setRemoteDescription && setRemoteDescription(result);
    setQrScannerModalIsOpen(false);
  }

  return (
    <>
      <MovingCircle dataChannel={dataChannel} isHost={true}/>
      <h1>Host</h1>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p>Offer</p>
          {localQRCode && (
            <img src={localQRCode} width={300} height={300} alt="" />
          )}
          <textarea cols={60} rows={20} defaultValue={localDescription ?? ""} />
          <button onClick={onClickHostCreateOffer}>
            Create offer for peer
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p>Remote description</p>

          {remoteQRCode && (
            <img src={remoteQRCode} width={300} height={300} alt="" />
          )}
          <textarea
            cols={60}
            rows={20}
            onChange={(event) =>
              setRemoteDescription && setRemoteDescription(event.target.value)
            }
            value={remoteDescription}
          />
          <button onClick={onClickHostSetAnswer}>
            Set remote description using answer from peer
          </button>
          <button onClick={onClickScan}>Scan</button>
        </div>
      </div>
      <QrScannerModal isOpen={qrScannerModalIsOpen} onResult={onResult}/>
    </>
  );
};

export default HostPage;
