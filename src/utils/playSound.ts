import notif from "../static/audio/notification.mp3";
import error from "../static/audio/error.mp3";

export const playSound = (type: "notification" | "error") => {
    const soundMap = {
        notification: notif,
        error: error,
    };

    const audio = new Audio(soundMap[type]);

    audio.play().catch((e) => {
        console.error(`Failed to play audio: ${soundMap[type]}`, e);
    });
    audio.addEventListener("error", () => {
        console.error(`Failed to load audio: ${soundMap[type]}`);
    });
};
