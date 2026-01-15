import { useState, useEffect } from "react";

interface CountdownProps {
  endTime: Date;
  onFinish?: () => void;
}

export function SimpleTimer({ endTime, onFinish }: CountdownProps) {
  // Inicializamos el estado calculando la diferencia inmediatamente
  const [timeLeft, setTimeLeft] = useState<number>(
    endTime.getTime() - Date.now(),
  );

  useEffect(() => {
    // Si la fecha ya pasó desde el inicio, no hacer nada
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      const diff = endTime.getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(intervalId);
        if (onFinish) onFinish();
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    // Limpieza al desmontar el componente
    return () => clearInterval(intervalId);
  }, [endTime]); // Si la fecha de fin cambia (ej. desde el backend), el timer se reinicia

  // Cálculos de tiempo
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

  if (timeLeft <= 0) {
    return <span>¡Expirado!</span>;
  }

  return (
    <div className="timer-display">
      {days > 0 && <span>{days}d </span>}
      <span>
        {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
