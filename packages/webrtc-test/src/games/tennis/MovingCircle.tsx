import { Container, Sprite, Stage, useTick } from "@pixi/react";
import { useEffect, useRef, useState } from "react";

type MovingCircleProps = {
  dataChannel?: RTCDataChannel;
  isHost: any;
};

const Bunny = ({ dataChannel, isHost }: MovingCircleProps) => {
  const [motion, setMotion] = useState<any>();
  const iter = useRef(0);
  const tickNumber = useRef(0);

  useTick((delta) => {
    if (isHost) {
      tickNumber.current++;
      const i = (iter.current += 0.05 * delta);

      const motionData = {
        x: Math.sin(i) * 100,
        y: Math.sin(i / 1.5) * 100,
        rotation: Math.sin(i) * Math.PI,
        anchor: Math.sin(i / 2),
      };

      setMotion(motionData);
      if (dataChannel?.readyState === "open") {
        console.log(`send motion: ${delta} `, motionData);
        dataChannel.send(JSON.stringify(motionData));
      }
    }
  });

  useEffect(() => {
    if (!isHost && dataChannel) {
      dataChannel.onmessage = (e) => {
        try {
          console.log("onmotion", e);
          const d = JSON.parse(e.data);
          setMotion(d);
        } catch (error) {
          console.error(error);
        }
      };
    }
  }, [dataChannel, isHost]);
  return (
    <Sprite image="https://pixijs.io/pixi-react/img/bunny.png" {...motion} />
  );
};

const MovingCircle = ({ dataChannel, isHost }: MovingCircleProps) => {
  return (
    <Stage width={300} height={300} options={{ backgroundAlpha: 0 }}>
      <Container x={150} y={150}>
        <Bunny dataChannel={dataChannel} isHost={isHost} />
      </Container>
    </Stage>
  );
};

export default MovingCircle;
