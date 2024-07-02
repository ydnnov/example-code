import { bus } from '../bus.js';

bus.on('parsing.play', () => {
    parsing.play();
});
bus.on('parsing.pause', () => {
    parsing.pause();
});
bus.on('parsing.step', () => {
    bus.emit('stepping');
});

const parsing = {
    paused: true,
    playingUntilStep: null,
    get playing() {
        return !parsing.paused;
    },
    pause() {
        parsing.paused = true;
    },
    play() {
        parsing.paused = false;
    },
    playUntilStep(step: string) {
        parsing.playingUntilStep = step;
    },
    async step(stepName: string) {
        bus.emit('parsing.step.' + stepName);
        if (parsing.playingUntilStep) {
            if (stepName !== parsing.playingUntilStep) {
                return;
            }
        } else {
            if (parsing.playing) {
                console.log('---> parsing.playing');
                return;
            }
        }
        console.log('---> parsing.paused');
        const result = await new Promise((resolve) => {
            bus.once('parsing.step', () => {
                console.log('---> parsing.step');
                resolve(false);
            });
            bus.once('parsing.play', () => {
                console.log('---> parsing.play');
                resolve(false);
            });
            bus.once('parsing.restart', () => {
                console.log('---> parsing.restart');
                resolve(true);
            });
        });
        return result;
    },
};

export { parsing };
