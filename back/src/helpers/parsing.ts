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
    pause() {
        parsing.paused = true;
    },
    play() {
        parsing.paused = false;
    },
    step(stepName: string) {
        bus.emit('parsing.step.' + stepName);
        if (!parsing.paused) {
            console.log('playing');
            return;
        }
        console.log('paused');
        const result = new Promise((resolve) => {
            bus.once('parsing.step', () => {
                resolve();
            });
            bus.once('parsing.play', () => {
                resolve();
            });
        });
        return result;
    },
};

export { parsing };
