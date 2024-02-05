import React, { createContext, useEffect, useState } from "react";

import QRCode from "qrcode";

type PeerContextType = {
  peerConnection: RTCPeerConnection | null;
  localDescription: string;
  remoteDescription: string;
  localQRCode?: string;
  remoteQRCode?: string;
  setLocalDescription?: (d: string) => void;
  setRemoteDescription?: (d: string) => void;
  connected: boolean;
};

export const PeerContext = createContext<PeerContextType>({
  peerConnection: null,
  localDescription: "",
  remoteDescription: "",
  connected: false,
});

const PeerProvider = ({ children }: React.PropsWithChildren) => {
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [localDescription, setLocalDescription] = React.useState("");
  const [remoteDescription, setRemoteDescription] = React.useState("");

  const [localQRCode, setLocalQRCode] = useState<string>();
  const [remoteQRCode, setRemoteQRCode] = useState<string>();

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (localDescription.length > 0) {
      QRCode.toDataURL(localDescription)
        .then((url) => {
          setLocalQRCode(url);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [localDescription]);

  useEffect(() => {
    if (remoteDescription.length > 0) {
      QRCode.toDataURL(remoteDescription)
        .then((url) => {
          setRemoteQRCode(url);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [remoteDescription]);

  useEffect(() => {
    const peer = new RTCPeerConnection({
      iceServers: [],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("onicecandidate", event.candidate);
      }
    };

    peer.oniceconnectionstatechange = () => {
      console.log("ICE STATE:", peer.iceConnectionState);
    };

    peer.onconnectionstatechange = () => {
      console.log("CONNECTION STATE:", peer.connectionState);
      // TODO: optimize rerenders
      if (peer.connectionState === "connected") {
        setConnected(true);
      } else {
        setConnected(false);
      }
    };

    peer.onsignalingstatechange = () => {
      console.log("SIGNALING STATE:", peer.signalingState);
    };

    setPeerConnection(peer);

    return () => {
      peer.close();
    };
  }, []);

  return (
    <PeerContext.Provider
      value={{
        peerConnection,
        localDescription,
        remoteDescription,
        setLocalDescription,
        setRemoteDescription,
        localQRCode,
        remoteQRCode,
        connected
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

export default PeerProvider;
