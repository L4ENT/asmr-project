import { useContext, useEffect, useState } from "react";
import { PeerContext } from "../providers/PeerProvider";
import QrScannerModal from "../components/QrScannerModal";
import MovingCircle from "../games/tennis/MovingCircle";

const PeerPage = () => {
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
  const [dataChannel, setDataChannel] = useState<RTCDataChannel>();

  useEffect(() => {
    if (!peerConnection) {
      return;
    }
    console.log("SET ON DATA CHANNEL");
    peerConnection.ondatachannel = (event) => {
      const dataChannel = event.channel;
      
      dataChannel.onopen = () => {
        console.log("RECEIVER CHANNEL OPEN", event);
      };
      dataChannel.onclose = () => console.log("Канал закрыт");
      setDataChannel(dataChannel);
    };
  }, [peerConnection]);

  const onClickPeerSetRemoteDescription = async () => {
    if (
      !peerConnection ||
      remoteDescription.length === 0 ||
      !setLocalDescription
    ) {
      return;
    }
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(JSON.parse(remoteDescription))
    );

    const answer = await peerConnection.createAnswer();
    peerConnection.setLocalDescription(answer);
    setLocalDescription(JSON.stringify(answer));
  };

  const onScan = () => {
    setQrScannerModalIsOpen(true);
  };

  const onResult = (result: string) => {
    setRemoteDescription && setRemoteDescription(result);
    setQrScannerModalIsOpen(false);
  };

  return (
    <>
      <MovingCircle dataChannel={dataChannel} isHost={false} />
      <h1>Peer</h1>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p>Remote description from host</p>
          {remoteQRCode && (
            <img src={remoteQRCode} width={300} height={300} alt="" />
          )}
          <textarea
            cols={60}
            rows={20}
            value={remoteDescription}
            onChange={(event) =>
              setRemoteDescription && setRemoteDescription(event.target.value)
            }
          />
          <button onClick={onClickPeerSetRemoteDescription}>
            Set remote descriptoin from server
          </button>
          <button onClick={onScan}>Scan QR code</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p>Local description (answer) to send to host</p>
          {localQRCode && (
            <img src={localQRCode} width={300} height={300} alt="" />
          )}
          <textarea readOnly cols={60} rows={20} value={localDescription} />
        </div>
      </div>
      <QrScannerModal isOpen={qrScannerModalIsOpen} onResult={onResult} />
    </>
  );
};

export default PeerPage;
