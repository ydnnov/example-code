import { ConfigType } from './types/config.type.js';

export const config: ConfigType = {
    autoSendScreenshots: true,
    moreCadnumsLoadCount: 10,
    countCadnumsBeforeLoadMore: 3,
    countDownloadedBeforeSendToMainServer: 1,
    cadnumsWhereRegex: null,
    // cadnumsWhereRegex: '^77:02:',
    waitForWssClient: false,
    viewportParams: {
        width: 800,
        height: 800,
    },
    fullRestartIntervalMinutes: 90,
    waitBetweenCadnumsSecs: 10,
    attemptTimeoutSecs: 60,
    waitBetweenAttemptsSecs: 5,
    maxAttemptsBeforeFailure: 15,
    onFailureWaitMinutes: 5,
};
